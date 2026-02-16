// Login Page - Email/Password only
import React from 'react';
import { Form, Input, Button, Checkbox, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import './LoginPage.css';

const { Title, Text, Link } = Typography;

export const LoginPage: React.FC = () => {
    const { loginWithEmail, isLoading, clearError } = useAuthStore();

    const [emailForm] = Form.useForm();

    const handleEmailLogin = async (values: { email: string; password: string; remember: boolean }) => {
        clearError();
        try {
            await loginWithEmail(values.email, values.password, values.remember);
            message.success('Login successful!');
            window.location.href = import.meta.env.BASE_URL + 'dashboard';
        } catch (error) {
            console.error('Login Error:', error);
            message.error('Login failed. Please check your credentials.');
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

            {/* Right Side - Login Form */}
            <div className="login-form-container">
                <div className="login-form-card">
                    <Title level={2}>Welcome Back</Title>
                    <Text type="secondary">Sign in to continue</Text>

                    <Form
                        form={emailForm}
                        layout="vertical"
                        onFinish={handleEmailLogin}
                        style={{ marginTop: 32 }}
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

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            หากพบปัญหาของการเข้าใช้งานระบบ โปรดติดต่อ คุณ อดินันท์ (โอห์ม) ฝ่าย IT
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};
