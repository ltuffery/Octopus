// src/composables/useWebhooks.ts
import { ref } from 'vue';

interface Webhook {
    id: string;
    name: string;
    url: string;
    method: string;
    status: 'active' | 'inactive';
    lastExecuted?: string;
    lastStatus?: 'success' | 'failed';
    organizationId: string;
    headers?: Record<string, string>;
    body?: string;
}

export function useWebhooks() {
    const webhooks = ref<Webhook[]>([]);
    const loading = ref(false);

    // Mock data pour le dev
    const mockWebhooks: Webhook[] = [
        {
            id: '1',
            name: 'Stripe Payment',
            url: 'https://api.stripe.com/webhooks',
            method: 'POST',
            status: 'active',
            lastExecuted: new Date().toISOString(),
            lastStatus: 'success',
            organizationId: 'org1'
        },
        {
            id: '2',
            name: 'Slack Notification',
            url: 'https://hooks.slack.com/services/xxx',
            method: 'POST',
            status: 'active',
            lastExecuted: new Date(Date.now() - 3600000).toISOString(),
            lastStatus: 'failed',
            organizationId: 'org1'
        },
        {
            id: '3',
            name: 'Email Service',
            url: 'https://api.sendgrid.com/v3/mail/send',
            method: 'POST',
            status: 'inactive',
            organizationId: 'org1'
        }
    ];

    const fetchWebhooks = async () => {
        loading.value = true;
        try {
            // TODO: Remplacer par vraie API
            await new Promise(resolve => setTimeout(resolve, 500));
            webhooks.value = mockWebhooks;
        } catch (error) {
            console.error('Failed to fetch webhooks:', error);
        } finally {
            loading.value = false;
        }
    };

    const createWebhook = async (data: Partial<Webhook>) => {
        loading.value = true;
        try {
            // TODO: Remplacer par vraie API
            await new Promise(resolve => setTimeout(resolve, 500));
            const newWebhook: Webhook = {
                id: Date.now().toString(),
                organizationId: 'org1',
                status: 'active',
                ...data
            } as Webhook;
            webhooks.value.push(newWebhook);
            return newWebhook;
        } finally {
            loading.value = false;
        }
    };

    const updateWebhook = async (data: Webhook) => {
        loading.value = true;
        try {
            // TODO: Remplacer par vraie API
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = webhooks.value.findIndex(w => w.id === data.id);
            if (index !== -1) {
                webhooks.value[index] = data;
            }
        } finally {
            loading.value = false;
        }
    };

    const deleteWebhook = async (id: string) => {
        loading.value = true;
        try {
            // TODO: Remplacer par vraie API
            await new Promise(resolve => setTimeout(resolve, 500));
            webhooks.value = webhooks.value.filter(w => w.id !== id);
        } finally {
            loading.value = false;
        }
    };

    return {
        webhooks,
        loading,
        fetchWebhooks,
        createWebhook,
        updateWebhook,
        deleteWebhook
    };
}
