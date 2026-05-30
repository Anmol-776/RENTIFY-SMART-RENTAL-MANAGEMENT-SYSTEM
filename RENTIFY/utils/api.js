const PropertyService = {
    getAll: async () => {
        try {
            const response = await trickleListObjects('property', 100, true);
            return response.items || [];
        } catch (error) {
            console.error("Error fetching properties:", error);
            return [];
        }
    },
    
    getById: async (id) => {
        try {
            return await trickleGetObject('property', id);
        } catch (error) {
            console.error("Error fetching property:", error);
            throw error;
        }
    },

    create: async (propertyData) => {
        try {
            return await trickleCreateObject('property', propertyData);
        } catch (error) {
            console.error("Error creating property:", error);
            throw error;
        }
    },

    update: async (id, propertyData) => {
        try {
            return await trickleUpdateObject('property', id, propertyData);
        } catch (error) {
            console.error("Error updating property:", error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            await trickleDeleteObject('property', id);
        } catch (error) {
            console.error("Error deleting property:", error);
            throw error;
        }
    },

    search: async (filters) => {
        const all = await PropertyService.getAll();
        return all.filter(p => {
            const d = p.objectData;
            if (filters.city && !d.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
            if (filters.type && d.type !== filters.type) return false;
            if (filters.minPrice && d.rent_price < filters.minPrice) return false;
            if (filters.maxPrice && d.rent_price > filters.maxPrice) return false;
            if (filters.status && d.status !== filters.status) return false;
            return true;
        });
    }
};

const ChatService = {
    getConversations: async (userId, role) => {
        try {
            const res = await trickleListObjects('conversation', 100, true);
            return (res.items || []).filter(c => 
                role === 'tenant' ? c.objectData.tenant_id === userId : c.objectData.owner_id === userId
            );
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    getMessages: async (conversationId) => {
        try {
            const res = await trickleListObjects('message', 100, false);
            return (res.items || []).filter(m => m.objectData.conversation_id === conversationId);
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    sendMessage: async (conversationId, senderId, content) => {
        return await trickleCreateObject('message', {
            conversation_id: conversationId,
            sender_id: senderId,
            content,
            is_read: false
        });
    },
    getOrCreateConversation: async (tenantId, ownerId, propertyId) => {
        const conversations = await ChatService.getConversations(tenantId, 'tenant');
        const existing = conversations.find(c => c.objectData.property_id === propertyId && c.objectData.owner_id === ownerId);
        if (existing) return existing;
        return await trickleCreateObject('conversation', {
            tenant_id: tenantId,
            owner_id: ownerId,
            property_id: propertyId
        });
    },
    markMessagesAsRead: async (conversationId, userId) => {
        try {
            const msgs = await ChatService.getMessages(conversationId);
            const unread = msgs.filter(m => !m.objectData.is_read && m.objectData.sender_id !== userId);
            for (const m of unread) {
                await trickleUpdateObject('message', m.objectId, { ...m.objectData, is_read: true });
            }
        } catch (e) {
            console.error(e);
        }
    }
};

const MaintenanceService = {
    getRequests: async (userId, role) => {
        try {
            const res = await trickleListObjects('maintenance', 100, true);
            // Quick mock filter, ideally owner needs to check property owner_id, but here we assume owners see all for their properties
            if (role === 'tenant') {
                return (res.items || []).filter(m => m.objectData.tenant_id === userId);
            } else {
                const props = await PropertyService.getAll();
                const ownerPropIds = props.filter(p => p.objectData.owner_id === userId).map(p => p.objectId);
                return (res.items || []).filter(m => ownerPropIds.includes(m.objectData.property_id));
            }
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    createRequest: async (data) => {
        return await trickleCreateObject('maintenance', { ...data, status: 'Pending' });
    },
    updateStatus: async (id, status) => {
        const req = await trickleGetObject('maintenance', id);
        return await trickleUpdateObject('maintenance', id, { ...req.objectData, status });
    }
};

const NotificationService = {
    getNotifications: async (userId) => {
        try {
            const res = await trickleListObjects('notification', 100, true);
            return (res.items || []).filter(n => n.objectData.user_id === userId);
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    createNotification: async (userId, title, message, type, link) => {
        return await trickleCreateObject('notification', {
            user_id: userId, title, message, type, link, is_read: false
        });
    },
    markAsRead: async (id) => {
        const notif = await trickleGetObject('notification', id);
        return await trickleUpdateObject('notification', id, { ...notif.objectData, is_read: true });
    }
};

const FavoriteService = {
    getUserFavorites: async (userId) => {
        try {
            const response = await trickleListObjects('favorite', 100, true);
            return (response.items || []).filter(f => f.objectData.user_id === userId);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            return [];
        }
    },
    
    toggleFavorite: async (userId, propertyId) => {
        try {
            const favorites = await FavoriteService.getUserFavorites(userId);
            const existing = favorites.find(f => f.objectData.property_id === propertyId);
            
            if (existing) {
                await trickleDeleteObject('favorite', existing.objectId);
                return false; // Removed
            } else {
                await trickleCreateObject('favorite', { user_id: userId, property_id: propertyId });
                return true; // Added
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            throw error;
        }
    }
};