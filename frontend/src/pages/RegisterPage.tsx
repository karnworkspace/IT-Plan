
import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // No Link import here to avoid confusion
import { useAuthStore } from '../store/authStore';
import './LoginPage.css'; // Re-use login styles

const { Title, Text, Link: AntLink } = Typography;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, clearError } = useAuthStore();
    const [form] = Form.useForm();

    const handleRegister = async (values: { email: string; password: string; name: string }) => {
        clearError();
        try {
            await register(values.email, values.password, values.name);
            message.success('Registration successful! Please login.');
            navigate('/login');
            // Or auto-login logic if preferred, but manual login is safer to verify flow
        } catch (error) {
            message.error('Registration failed. Email might be already in use.');
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - SENA Branding */}
            <div className="login-branding">
                <div className="branding-title">
                    <div className="app-name">SENA</div>
                    <div className="app-subtitle">IT Project Progress</div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="login-form-container">
                <div className="login-form-card">
                    <Title level={2}>Create Account</Title>
                    <Text type="secondary">Sign up to get started</Text>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleRegister}
                        style={{ marginTop: 32 }}
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Full Name"
                                size="large"
                            />
                        </Form.Item>

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
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm Password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                                Register
                            </Button>
                        </Form.Item>
                    </Form>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text type="secondary">
                            Already have an account? <AntLink onClick={() => navigate('/login')}>Sign In</AntLink>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};
