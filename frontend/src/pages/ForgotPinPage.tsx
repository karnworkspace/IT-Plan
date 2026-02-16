// Forgot PIN Page - Request PIN reset
import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Steps, Result } from 'antd';
import { MailOutlined, KeyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PinInput } from '../components/PinInput';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils/getErrorMessage';
import './LoginPage.css';

const { Title, Text, Link } = Typography;

export const ForgotPinPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Request PIN reset
    const handleRequestReset = async (values: { email: string }) => {
        setIsLoading(true);
        try {
            const response = await authService.requestPinReset(values.email);
            setEmail(values.email);

            // For UAT, the token is returned directly
            if (response.resetToken) {
                setResetToken(response.resetToken);
                message.success('Reset token generated! Check your email.');
            }

            setCurrentStep(1);
        } catch (error) {
            message.error(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset PIN with token
    const handleResetPin = async () => {
        if (newPin.length !== 6) {
            message.error('Please enter a 6-digit PIN');
            return;
        }

        if (newPin !== confirmPin) {
            message.error('PINs do not match');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPinWithToken(resetToken, newPin, confirmPin);
            message.success('PIN reset successfully!');
            setCurrentStep(2);
        } catch (error) {
            message.error(getErrorMessage(error));
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
                                Send Reset Token
                            </Button>
                        </Form.Item>
                    </Form>
                );

            case 1:
                return (
                    <div style={{ marginTop: 24 }}>
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

                        <Form layout="vertical">
                            <Form.Item label="Reset Token">
                                <Input
                                    prefix={<KeyOutlined />}
                                    placeholder="Paste your reset token"
                                    size="large"
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item label="New PIN">
                                <div style={{ marginBottom: 8 }}>
                                    <PinInput
                                        onChange={setNewPin}
                                        onComplete={setNewPin}
                                        masked={true}
                                        disabled={isLoading}
                                    />
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Enter a 6-digit PIN
                                </Text>
                            </Form.Item>

                            <Form.Item label="Confirm PIN">
                                <div style={{ marginBottom: 8 }}>
                                    <PinInput
                                        onChange={setConfirmPin}
                                        onComplete={setConfirmPin}
                                        masked={true}
                                        disabled={isLoading}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={isLoading}
                                    onClick={handleResetPin}
                                    disabled={!resetToken || newPin.length !== 6 || confirmPin.length !== 6}
                                >
                                    Reset PIN
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                );

            case 2:
                return (
                    <Result
                        status="success"
                        title="PIN Reset Successfully!"
                        subTitle="You can now login with your new PIN."
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
            {/* Left Side - SENA Branding */}
            <div className="login-branding">
                <div className="branding-title">
                    <div className="app-name">SENA</div>
                    <div className="app-subtitle">IT Project Progress</div>
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

                    <Title level={2}>Reset PIN</Title>
                    <Text type="secondary">
                        {currentStep === 0 && "Enter your email to receive a reset token"}
                        {currentStep === 1 && "Enter your reset token and new PIN"}
                        {currentStep === 2 && "PIN reset complete"}
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
                                Remember your PIN? <Link onClick={() => navigate('/login')}>Sign In</Link>
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
