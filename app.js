// app.js

const { useState, useEffect } = React;

// --- Components ---

// 1. LOGIN / LANDING PAGE
class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { email: '', password: '' };
    }

    handleLogin = (e) => {
        e.preventDefault();
        if(this.state.email && this.state.password) {
            this.props.onLogin(this.state.email);
        } else {
            alert("Please enter credentials");
        }
    }

    render() {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white fade-in">
                <h1 className="text-5xl font-bold mb-4">SkillBridge</h1>
                <p className="text-xl mb-8">Connect with Top Tier Freelancers</p>
                
                {/* Feature Highlights */}
                <div className="grid grid-cols-3 gap-4 mb-10 text-black">
                    {['Verified Experts', 'Secure Payments', 'SDG 8: Decent Work'].map(f => (
                        <div key={f} className="bg-white p-4 rounded-lg shadow-lg text-center font-semibold">
                            {f}
                        </div>
                    ))}
                </div>

                <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Member Login</h2>
                    <form onSubmit={this.handleLogin} className="space-y-4">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full p-3 border rounded"
                            value={this.state.email}
                            onChange={(e) => this.setState({email: e.target.value})}
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full p-3 border rounded"
                            value={this.state.password}
                            onChange={(e) => this.setState({password: e.target.value})}
                        />
                        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

// 2. CALCULATOR PAGE (Uses Factory & Strategy)
class CalculatorPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceType: 'web',
            complexity: 1,
            hours: 10,
            isRush: false,
            estimatedCost: 0
        };
    }

    calculate = () => {
        // Factory Logic
        const service = window.ServiceFactory.createService(this.state.serviceType);
        
        // Strategy Logic
        let strategy;
        if (this.state.isRush) {
            strategy = new window.RushPricing();
        } else if (this.state.complexity > 5) {
            strategy = new window.PremiumComplexityPricing();
        } else {
            strategy = new window.StandardPricing();
        }

        const cost = strategy.calculate(service.baseRate, this.state.complexity, this.state.hours);
        this.setState({ estimatedCost: cost });
    }

    handleBook = () => {
        this.props.onBook({
            service: this.state.serviceType,
            cost: this.state.estimatedCost,
            date: new Date().toLocaleDateString()
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // Recalculate if inputs change
        if (prevState !== this.state) {
            this.calculate();
        }
    }

    render() {
        return (
            <div className="p-8 fade-in max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Project Estimator</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Service Type</label>
                            <select 
                                className="w-full p-2 border rounded"
                                value={this.state.serviceType}
                                onChange={(e) => this.setState({serviceType: e.target.value})}
                            >
                                <option value="design">Graphic Design ($50/hr)</option>
                                <option value="web">Web Development ($100/hr)</option>
                                <option value="content">Content Writing ($30/hr)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Complexity (1-10)</label>
                            <input 
                                type="range" min="1" max="10" 
                                className="w-full"
                                value={this.state.complexity}
                                onChange={(e) => this.setState({complexity: parseInt(e.target.value)})}
                            />
                            <p className="text-sm text-gray-500">Level: {this.state.complexity}</p>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Estimated Hours</label>
                            <input 
                                type="number" 
                                className="w-full p-2 border rounded"
                                value={this.state.hours}
                                onChange={(e) => this.setState({hours: parseInt(e.target.value)})}
                            />
                        </div>

                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                className="mr-2 h-5 w-5"
                                checked={this.state.isRush}
                                onChange={(e) => this.setState({isRush: e.target.checked})}
                            />
                            <label>Rush Order (+50%)</label>
                        </div>
                    </div>

                    <div className="bg-blue-900 text-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center">
                        <h3 className="text-xl mb-2">Estimated Total</h3>
                        <div className="text-5xl font-bold mb-6">${this.state.estimatedCost.toFixed(2)}</div>
                        <button 
                            onClick={this.handleBook}
                            className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full font-bold transition w-full"
                        >
                            Book This Service
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

// 3. DASHBOARD PAGE (Uses Observer)
class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        };
        // Initialize Observer System
        this.notificationSystem = new window.NotificationSubject();
        this.emailObs = new window.EmailObserver();
        this.whatsAppObs = new window.WhatsAppObserver();
        
        this.notificationSystem.subscribe(this.emailObs);
        this.notificationSystem.subscribe(this.whatsAppObs);
    }

    componentDidMount() {
        // Simulate processing the latest order
        if (this.props.lastOrder) {
            const emailMsg = this.emailObs.update({ email: this.props.userEmail, cost: this.props.lastOrder.cost });
            const whatsAppMsg = this.whatsAppObs.update({ phone: "+1234567890" });
            
            this.setState({
                notifications: [emailMsg, whatsAppMsg]
            });
        }
    }

    render() {
        return (
            <div className="p-8 fade-in max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">User Dashboard</h2>
                <p className="mb-4">Welcome back, <span className="font-bold text-blue-600">{this.props.userEmail}</span></p>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-green-500">
                    <h3 className="text-xl font-bold mb-2">Latest Booking</h3>
                    {this.props.lastOrder ? (
                        <div className="space-y-2">
                            <p><strong>Service:</strong> {this.props.lastOrder.service}</p>
                            <p><strong>Cost:</strong> ${this.props.lastOrder.cost.toFixed(2)}</p>
                            <p><strong>Date:</strong> {this.props.lastOrder.date}</p>
                        </div>
                    ) : (
                        <p>No active orders.</p>
                    )}
                </div>

                <div className="bg-gray-800 text-green-400 p-6 rounded-lg font-mono">
                    <h3 className="text-white text-lg mb-4 border-b border-gray-600 pb-2">System Notification Logs (Observer Pattern)</h3>
                    {this.state.notifications.map((note, idx) => (
                        <div key={idx} className="mb-2">> {note}</div>
                    ))}
                    <div className="animate-pulse">> Waiting for updates...</div>
                </div>
            </div>
        );
    }
}

// --- MAIN APP CONTAINER ---
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 'login', // login, calculator, dashboard
            userEmail: '',
            lastOrder: null
        };
    }

    handleLogin = (email) => {
        this.setState({ userEmail: email, currentPage: 'calculator' });
    }

    handleBook = (orderData) => {
        this.setState({ lastOrder: orderData, currentPage: 'dashboard' });
    }

    handleNav = (page) => {
        this.setState({ currentPage: page });
    }

    render() {
        return (
            <div>
                {/* Navigation Bar (Only visible after login) */}
                {this.state.currentPage !== 'login' && (
                    <nav className="bg-white shadow p-4 flex justify-between items-center">
                        <div className="font-bold text-xl text-blue-600">SkillBridge</div>
                        <div className="space-x-4">
                            <button onClick={() => this.handleNav('calculator')} className="hover:text-blue-500">Calculator</button>
                            <button onClick={() => this.handleNav('dashboard')} className="hover:text-blue-500">Dashboard</button>
                            <button onClick={() => this.setState({currentPage: 'login', userEmail: ''})} className="text-red-500">Logout</button>
                        </div>
                    </nav>
                )}

                {/* Page Routing */}
                {this.state.currentPage === 'login' && <LandingPage onLogin={this.handleLogin} />}
                {this.state.currentPage === 'calculator' && <CalculatorPage onBook={this.handleBook} />}
                {this.state.currentPage === 'dashboard' && <DashboardPage userEmail={this.state.userEmail} lastOrder={this.state.lastOrder} />}
            </div>
        );
    }
}

// Render to DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
