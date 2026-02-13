// Forgot Password Page - Request password reset
import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Steps, Result } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './LoginPage.css';

const { Title, Text, Link } = Typography;

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Request password reset
    const handleRequestReset = async (values: { email: string }) => {
        setIsLoading(true);
        try {
            const response = await authService.requestPasswordReset(values.email);
            setEmail(values.email);

            // For UAT, the token is returned directly
            if (response.resetToken) {
                setResetToken(response.resetToken);
                message.success('Reset token generated! Check your email.');
            }

            setCurrentStep(1);
        } catch (error: any) {
            message.error(error.message || 'Failed to request password reset');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset password with token
    const handleResetPassword = async (values: { token: string; newPassword: string; confirmPassword: string }) => {
        setIsLoading(true);
        try {
            await authService.resetPassword(values.token, values.newPassword, values.confirmPassword);
            message.success('Password reset successfully!');
            setCurrentStep(2);
        } catch (error: any) {
            message.error(error.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Form
                        layout="vertical"
                        onFinish={handleRequestReset}
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
                                placeholder="Enter your email address"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                                Send Reset Link
                            </Button>
                        </Form.Item>
                    </Form>
                );

            case 1:
                return (
                    <Form
                        layout="vertical"
                        onFinish={handleResetPassword}
                        initialValues={{ token: resetToken }}
                        style={{ marginTop: 24 }}
                    >
                        <div style={{ marginBottom: 16, padding: 12, background: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
                            <Text type="secondary">
                                A reset token has been sent to <strong>{email}</strong>
                            </Text>
                            {resetToken && (
                                <div style={{ marginTop: 8 }}>
                                    <Text copyable={{ text: resetToken }} style={{ fontSize: 12 }}>
                                        Token (UAT): {resetToken.substring(0, 20)}...
                                    </Text>
                                </div>
                            )}
                        </div>

                        <Form.Item
                            name="token"
                            label="Reset Token"
                            rules={[{ required: true, message: 'Please enter the reset token' }]}
                        >
                            <Input
                                prefix={<KeyOutlined />}
                                placeholder="Paste your reset token"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                { required: true, message: 'Please enter your new password' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter new password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm new password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
                                Reset Password
                            </Button>
                        </Form.Item>
                    </Form>
                );

            case 2:
                return (
                    <Result
                        status="success"
                        title="Password Reset Successfully!"
                        subTitle="You can now login with your new password."
                        extra={[
                            <Button type="primary" key="login" onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                        ]}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Branding */}
            <div className="login-branding">
                <div className="branding-content">
                    <div className="logo">
                        <LockOutlined style={{ fontSize: 48 }} />
                        <Title level={1} style={{ color: 'white', marginTop: 16 }}>TaskFlow</Title>
                    </div>

                    <Title level={3} style={{ color: 'white', fontWeight: 400, marginTop: 40 }}>
                        Forgot your password?<br />
                        No worries!<br />
                        We'll help you reset it.
                    </Title>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-form-container">
                <div className="login-form-card">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/login')}
                        style={{ marginBottom: 16 }}
                    >
                        Back to Login
                    </Button>

                    <Title level={2}>Reset Password</Title>
                    <Text type="secondary">
                        {currentStep === 0 && "Enter your email to receive a reset link"}
                        {currentStep === 1 && "Enter your reset token and new password"}
                        {currentStep === 2 && "Password reset complete"}
                    </Text>

                    <Steps
                        current={currentStep}
                        size="small"
                        style={{ marginTop: 24, marginBottom: 8 }}
                        items={[
                            { title: 'Email' },
                            { title: 'Reset' },
                            { title: 'Done' },
                        ]}
                    />

                    {renderStep()}

                    {currentStep < 2 && (
                        <div style={{ textAlign: 'center', marginTop: 24 }}>
                            <Text type="secondary">
                                Remember your password? <Link onClick={() => navigate('/login')}>Sign In</Link>
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
