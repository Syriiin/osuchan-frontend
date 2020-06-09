import React from "react";
import styled, { keyframes } from "styled-components";

const animation = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`;

const LoadingWrapper = styled.div<LoadingWrapperProps>`
    display: inline-block;
    position: relative;
    width: ${props => props.scale ? props.scale * 80 : 80}px;
    height: ${props => props.scale ? props.scale * 80 : 80}px;

    div {
        animation: ${animation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: ${props => props.scale ? props.scale * 40 : 40}px ${props => props.scale ? props.scale * 40 : 40}px;
    }

    div:after {
        content: " ";
        display: block;
        position: absolute;
        width: ${props => props.scale ? props.scale * 7 : 7}px;
        height: ${props => props.scale ? props.scale * 7 : 7}px;
        border-radius: 50%;
        background: #fff;
        margin: -${props => props.scale ? props.scale * 4 : 4}px 0 0 -${props => props.scale ? props.scale * 4 : 4}px;
    }

    div:nth-child(1) {
        animation-delay: -0.036s;
    }

    div:nth-child(1):after {
        top: ${props => props.scale ? props.scale * 63 : 63}px;
        left: ${props => props.scale ? props.scale * 63 : 63}px;
    }

    div:nth-child(2) {
        animation-delay: -0.072s;
    }

    div:nth-child(2):after {
        top: ${props => props.scale ? props.scale * 68 : 68}px;
        left: ${props => props.scale ? props.scale * 56 : 56}px;
    }

    div:nth-child(3) {
        animation-delay: -0.108s;
    }

    div:nth-child(3):after {
        top: ${props => props.scale ? props.scale * 71 : 71}px;
        left: ${props => props.scale ? props.scale * 48 : 48}px;
    }

    div:nth-child(4) {
        animation-delay: -0.144s;
    }

    div:nth-child(4):after {
        top: ${props => props.scale ? props.scale * 72 : 72}px;
        left: ${props => props.scale ? props.scale * 40 : 40}px;
    }

    div:nth-child(5) {
        animation-delay: -0.18s;
    }

    div:nth-child(5):after {
        top: ${props => props.scale ? props.scale * 71 : 71}px;
        left: ${props => props.scale ? props.scale * 32 : 32}px;
    }

    div:nth-child(6) {
        animation-delay: -0.216s;
    }

    div:nth-child(6):after {
        top: ${props => props.scale ? props.scale * 68 : 68}px;
        left: ${props => props.scale ? props.scale * 24 : 24}px;
    }

    div:nth-child(7) {
        animation-delay: -0.252s;
    }

    div:nth-child(7):after {
        top: ${props => props.scale ? props.scale * 63 : 63}px;
        left: ${props => props.scale ? props.scale * 17 : 17}px;
    }

    div:nth-child(8) {
        animation-delay: -0.288s;
    }

    div:nth-child(8):after {
        top: ${props => props.scale ? props.scale * 56 : 56}px;
        left: ${props => props.scale ? props.scale * 12 : 12}px;
    }
`;

const LoadingPageWrapper = styled.div`
    margin-top: 25vh;
    display: block;
    text-align: center;
`;

const LoadingText = styled.h1`
    font-size: 3em;
    font-weight: 300;
`;

interface LoadingWrapperProps {
    scale?: number;
}

export const LoadingSpinner = (props: LoadingProps) => {
    return (
        <LoadingWrapper scale={props.scale}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </LoadingWrapper>
    );
}

interface LoadingProps {
    scale?: number;
}

export const LoadingPage = () => {
    return (
        <LoadingPageWrapper>
            <LoadingSpinner scale={2} />
            <LoadingText>Loading...</LoadingText>
        </LoadingPageWrapper>
    );
}
