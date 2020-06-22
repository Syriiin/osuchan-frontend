import React, { useRef, useEffect } from "react";

export const BottomScrollDetector = (props: BottomScrollDetectorProps) => {
    const onBottomScrolled = props.onBottomScrolled;
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const onScroll = () => {
            if (wrapperRef.current!.getBoundingClientRect().bottom <= window.innerHeight) {
                onBottomScrolled();
            }
        }
        
        document.addEventListener("scroll", onScroll);
        return () => document.removeEventListener("scroll", onScroll);
    }, [onBottomScrolled]);

    return (
        <div ref={wrapperRef}>
            {props.children}
        </div>
    );
}

interface BottomScrollDetectorProps {
    children: React.ReactNode;
    onBottomScrolled: () => void;
}
