// Login Page with PIN and Email/Password options - Updated with Auth Store
import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Checkbox, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PinInput } from '../components/PinInput';
import { useAuthStore } from '../store/authStore';
import './LoginPage.css';

const { Title, Text, Link } = Typography;
const { TabPane } = Tabs;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { loginWithEmail, loginWithPin, isLoading, error, clearError } = useAuthStore();

    const [activeTab, setActiveTab] = useState<'email' | 'pin'>('pin');

    // Email/Password login state
    const [emailForm] = Form.useForm();

    // PIN login state
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [rememberDevice, setRememberDevice] = useState(false);

    const handleEmailLogin = async (values: { email: string; password: string; remember: boolean }) => {
        clearError();
        try {
            await loginWithEmail(values.email, values.password, values.remember);
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            message.error('Login failed. Please check your credentials.');
        }
    };

    const handlePinLogin = async () => {
        if (!email) {
            message.error('Please enter your email');
            return;
        }

        if (pin.length !== 6) {
            message.error('Please enter your 6-digit PIN');
            return;
        }

        clearError();
        try {
            await loginWithPin(email, pin, rememberDevice);
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            message.error('Invalid email or PIN');
            setPin(''); // Clear PIN on error
        }
    };

    const handlePinComplete = (completedPin: string) => {
        setPin(completedPin);
    };

    return (
        <div className="login-container">
            {/* Left Side - Branding */}
            <div className="login-branding">
                <div className="branding-content">
                    <div className="logo">
                        <UserOutlined style={{ fontSize: 48 }} />
                        <Title level={1} style={{ color: 'white', marginTop: 16 }}>TaskFlow</Title>
                    </div>

                    <Title level={3} style={{ color: 'white', fontWeight: 400, marginTop: 40 }}>
                        Manage Projects.<br />
                        Track Progress.<br />
                        Achieve Goals.
                    </Title>

                    <div className="features">
                        <div className="feature-item">
                            <div className="feature-icon">👥</div>
                            <div>
                                <div className="feature-title">Real-time Collaboration</div>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🔔</div>
                            <div>
                                <div className="feature-title">Smart Notifications</div>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📊</div>
                            <div>
                                <div className="feature-title">Powerful Analytics</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="login-form-container">
                <div className="login-form-card">
                    <Title level={2}>Welcome Back</Title>
                    <Text type="secondary">Sign in to continue</Text>

                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key as 'email' | 'pin')}
                        style={{ marginTop: 32 }}
                    >
                        {/* Email/Password Tab */}
                        <TabPane tab="Email Login" key="email">
                            <Form
                                form={emailForm}
                                layout="vertical"
                                onFinish={handleEmailLogin}
                                style={{ marginTop: 24 }}
                            >
                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email' },
                                        { type: 'email', message: 'Please enter a valid email' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Email"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please enter your password' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Password"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox>Remember me</Checkbox>
                                        </Form.Item>
                                        <Link href="/forgot-password">Forgot Password?</Link>
                                    </div>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>

                        {/* PIN Login Tab */}
                        <TabPane tab="PIN Login" key="pin">
                            <div style={{ marginTop: 24 }}>
                                <Form layout="vertical">
                                    <Form.Item label="Email">
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            size="large"
                                            disabled={isLoading}
                                        />
                                    </Form.Item>

                                    <Form.Item label={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <LockOutlined />
                                            <span>Enter your PIN</span>
                                        </div>
                                    }>
                                        <PinInput
                                            onChange={setPin}
                                            onComplete={handlePinComplete}
                                            masked={true}
                                            disabled={isLoading}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                Your personal 6-digit PIN
                                            </Text>
                                            <Link href="/forgot-pin" style={{ fontSize: 12 }}>
                                                Forgot PIN?
                                            </Link>
                                        </div>
                                    </Form.Item>

                                    <Form.Item>
                                        <Checkbox
                                            checked={rememberDevice}
                                            onChange={(e) => setRememberDevice(e.target.checked)}
                                        >
                                            Remember this device
                                        </Checkbox>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            loading={isLoading}
                                            onClick={handlePinLogin}
                                            disabled={!email || pin.length !== 6}
                                        >
                                            Sign In
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </TabPane>
                    </Tabs>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text type="secondary">
                            Don't have an account? <Link href="/signup">Sign Up</Link>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};
