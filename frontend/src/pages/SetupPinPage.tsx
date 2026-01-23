// Setup PIN Page - Updated with Auth Store
import React, { useState } from 'react';
import { Card, Form, Button, Typography, Progress, message, Space } from 'antd';
import { LockOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PinInput } from '../components/PinInput';
import { useAuthStore } from '../store/authStore';
import './SetupPinPage.css';

const { Title, Text } = Typography;

export const SetupPinPage: React.FC = () => {
    const navigate = useNavigate();
    const { setupPin, isLoading } = useAuthStore();

    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // PIN validation checks
    const checks = {
        length: pin.length === 6,
        notSequential: (() => {
            if (pin.length !== 6) return false;
            const isAscending = /^(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){5}\d$/.test(pin);
            const isDescending = /^(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){5}\d$/.test(pin);
            return !isAscending && !isDescending;
        })(),
        notRepeated: pin.length === 6 && !/^(\d)\1{5}$/.test(pin),
    };

    const allChecksValid = Object.values(checks).every(Boolean);
    const pinsMatch = pin === confirmPin && pin.length === 6;

    const handleSubmit = async () => {
        if (!allChecksValid) {
            message.error('Please meet all PIN requirements');
            return;
        }

        if (!pinsMatch) {
            message.error('PINs do not match');
            return;
        }

        try {
            await setupPin(pin, confirmPin);
            message.success('PIN setup successfully!');
            navigate('/dashboard');
        } catch (error) {
            message.error('Failed to setup PIN');
        }
    };

    return (
        <div className="setup-pin-container">
            <Card className="setup-pin-card">
                {/* Progress Indicator */}
                <div className="progress-indicator">
                    <Text type="secondary">Step 3 of 3</Text>
                    <Progress percent={100} showInfo={false} />
                </div>

                {/* Header */}
                <div className="setup-pin-header">
                    <LockOutlined className="lock-icon" />
                    <Title level={2}>Setup Your PIN</Title>
                    <Text type="secondary">Create a 6-digit PIN to secure your account</Text>
                </div>

                {/* Form */}
                <Form layout="vertical" className="setup-pin-form">
                    {/* Create PIN */}
                    <Form.Item label={<Text strong>Create PIN</Text>}>
                        <PinInput onChange={setPin} masked />
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                            Choose a PIN that's easy to remember but hard to guess
                        </Text>
                    </Form.Item>

                    {/* Confirm PIN */}
                    <Form.Item label={<Text strong>Confirm PIN</Text>}>
                        <PinInput onChange={setConfirmPin} masked />
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                            Re-enter your PIN to confirm
                        </Text>
                    </Form.Item>

                    {/* PIN Requirements */}
                    <div className="pin-requirements">
                        <Text strong>PIN REQUIREMENTS</Text>
                        <div className="requirements-list">
                            <div className={`requirement-item ${checks.length ? 'valid' : ''}`}>
                                {checks.length && <CheckCircleOutlined />}
                                <span>Must be 6 digits</span>
                            </div>
                            <div className={`requirement-item ${checks.notSequential ? 'valid' : ''}`}>
                                {checks.notSequential && <CheckCircleOutlined />}
                                <span>Cannot be sequential (e.g., 123456)</span>
                            </div>
                            <div className={`requirement-item ${checks.notRepeated ? 'valid' : ''}`}>
                                {checks.notRepeated && <CheckCircleOutlined />}
                                <span>Cannot be repeated (e.g., 111111)</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Tip */}
                    <div className="security-tip">
                        <InfoCircleOutlined />
                        <Text>Tip: Use a PIN that's meaningful to you but not obvious to others</Text>
                    </div>

                    {/* Buttons */}
                    <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 32 }}>
                        <Button size="large" onClick={() => navigate('/login')}>Back</Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            loading={isLoading}
                            disabled={!allChecksValid || !pinsMatch}
                        >
                            Complete Setup
                        </Button>
                    </Space>

                    {/* Footer Text */}
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
                        You can change your PIN anytime in Settings
                    </Text>
                </Form>
            </Card>
        </div>
    );
};
