import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewStyle, View } from 'react-native';

interface TouchableScaleProps {
    onPress?: () => void;
    children: React.ReactNode;
    style?: ViewStyle | any;
    disabled?: boolean;
    activeScale?: number;
    [key: string]: any;
}

const TouchableScale: React.FC<TouchableScaleProps> = ({
    onPress,
    children,
    style,
    disabled,
    activeScale = 0.95,
    ...rest
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        if (disabled) return;
        Animated.spring(scaleValue, {
            toValue: activeScale,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const onPressOut = () => {
        if (disabled) return;
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={disabled}
        >
            <Animated.View {...rest} style={[style, { transform: [{ scale: scaleValue }] }]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default TouchableScale;
