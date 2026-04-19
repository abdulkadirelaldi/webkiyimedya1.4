// src/components/StarfieldBackground.jsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';

const StarfieldBackground = () => {
    const canvasRef = useRef(null);
    const theme = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let stars = [];
        const numStars = 800; // Yıldız sayısı
        const starSpeed = 0.2; // Temel hız

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Mouse interaction
        let mouseX = width / 2;
        let mouseY = height / 2;
        let isMouseMoving = false;
        let mouseTimeout;

        // Initialize Canvas
        const initCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        // Star Class
        class Star {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = (Math.random() - 0.5) * width * 3; // Geniş bir alana yay
                this.y = (Math.random() - 0.5) * height * 3;
                this.z = Math.random() * width; // Derinlik
                this.size = Math.random() * 2;
                this.originalZ = this.z;

                // İlk açılışta rastgele z pozisyonu, yoksa en arkadan başla
                if (!initial) this.z = width;
            }

            update(scrollY) {
                // 1. Z-hareketi (Sahneye doğru geliyormuş gibi)
                this.z -= starSpeed * 5;

                // 2. Scroll Parallax (Aşağı indikçe yıldızlar yukarı kaysın)
                const parallaxY = scrollY * 0.5;

                // 3. Mouse Repulsion (Fareye yaklaşınca kaçış)
                // Projeksiyon öncesi hesaplama
                const projectedX = (this.x / this.z) * width + width / 2;
                const projectedY = ((this.y - parallaxY) / this.z) * height + height / 2;

                const dx = projectedX - mouseX;
                const dy = projectedY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150; // Etki alanı
                const force = (maxDistance - distance) / maxDistance;

                if (distance < maxDistance) {
                    const angle = Math.atan2(dy, dx);
                    // Yıldızı it
                    this.x += Math.cos(angle) * force * 50;
                    this.y += Math.sin(angle) * force * 50;
                }

                // Ekrana çok yaklaşınca veya dışarı çıkınca resetle
                if (this.z <= 0) {
                    this.reset();
                }
            }

            draw() {
                const scrollY = window.scrollY;
                const parallaxY = scrollY * 0.5; // Scroll etkisi

                // 3D Projeksiyon Formülü
                const x = (this.x / this.z) * width + width / 2;
                const y = ((this.y - parallaxY) / this.z) * height + height / 2;

                // Boyut derinliğe göre değişsin (Yaklaştıkça büyüsün)
                const s = (width / this.z) * this.size;

                // Sadece ekran içindekileri çiz
                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    // Parlaklık derinliğe göre (Uzaktakiler sönük)
                    const opacity = 1 - (this.z / width);

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.arc(x, y, s > 0 ? s : 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // Yıldızları oluştur
        const initStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        };

        const render = () => {
            // Arka planı temizle (Hafif iz bırakmak için tam temizleme yerine fillRect kullanılabilir ama şimdilik clear)
            ctx.clearRect(0, 0, width, height);

            // Mouse hareketi bittiyse merkeze dönme gibi bir logic eklenebilir ama şimdilik gerek yok

            const scrollY = window.scrollY;

            stars.forEach(star => {
                star.update(scrollY);
                star.draw();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        // Event Listeners
        const handleResize = () => {
            initCanvas();
            initStars();
        };

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;

            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMouseMoving = false;
            }, 100);
        };

        initCanvas();
        initStars();
        render();

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0, // Aurora'nın üstünde, içeriğin altında
                background: 'transparent',
                pointerEvents: 'none'
            }}
        />
    );
};

export default StarfieldBackground;
