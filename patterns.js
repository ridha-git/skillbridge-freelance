// patterns.js

// --- 1. FACTORY PATTERN (For Service Types) ---
class Service {
    constructor(name, baseRate) {
        this.name = name;
        this.baseRate = baseRate;
    }
}

class DesignService extends Service {
    constructor() { super("Graphic Design", 50); }
}

class WebService extends Service {
    constructor() { super("Web Development", 100); }
}

class ContentService extends Service {
    constructor() { super("Content Writing", 30); }
}

class ServiceFactory {
    static createService(type) {
        switch (type) {
            case 'design': return new DesignService();
            case 'web': return new WebService();
            case 'content': return new ContentService();
            default: return new Service("Generic", 20);
        }
    }
}

// --- 2. STRATEGY PATTERN (For Pricing Calculation) ---
class PricingStrategy {
    calculate(baseRate, complexity, hours) {
        return baseRate * hours;
    }
}

class StandardPricing extends PricingStrategy {
    calculate(baseRate, complexity, hours) {
        // Standard is flat rate based on hours
        return baseRate * hours;
    }
}

class RushPricing extends PricingStrategy {
    calculate(baseRate, complexity, hours) {
        // Rush adds 50% premium
        return (baseRate * hours) * 1.5;
    }
}

class PremiumComplexityPricing extends PricingStrategy {
    calculate(baseRate, complexity, hours) {
        // High complexity adds multiplier
        return (baseRate * hours) * (1 + (complexity / 10)); 
    }
}

// --- 3. OBSERVER PATTERN (For Notifications) ---
class NotificationSubject {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class EmailObserver {
    update(data) {
        console.log(`[Email System]: Sending invoice to ${data.email} for $${data.cost}`);
        return `Email sent to ${data.email}: Invoice #${Math.floor(Math.random() * 1000)}`;
    }
}

class WhatsAppObserver {
    update(data) {
        console.log(`[WhatsApp]: Ping user ${data.phone} about order status.`);
        return `WhatsApp sent to ${data.phone}: "Your order is confirmed!"`;
    }
}

// Exporting to global window for browser access
window.ServiceFactory = ServiceFactory;
window.StandardPricing = StandardPricing;
window.RushPricing = RushPricing;
window.PremiumComplexityPricing = PremiumComplexityPricing;
window.NotificationSubject = NotificationSubject;
window.EmailObserver = EmailObserver;
window.WhatsAppObserver = WhatsAppObserver;
