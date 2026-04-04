// lightbox.js - 支持缩放/拖拽的图片灯箱（移动端双击复位修复版）
(function (global) {
    'use strict';

    // ---------- 状态变量 ----------
    let activeLightbox = false;
    let isAnimating = false;
    let lightboxElement = null;
    let cloneImg = null;
    let closeBtn = null;
    let originalImgRef = null;
    let resizeHandler = null;
    let escHandler = null;
    let originalOverflow = '';

    // 缩放/拖拽相关状态
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let translate = { x: 0, y: 0 };
    let scale = 1;
    let initialDistance = 0;
    let initialScale = 1;
    let lastTouchCount = 0;
    let isResetting = false;

    // 移动端双击检测
    let lastTap = 0;
    let tapTimer = null;

    const MIN_SCALE = 1;
    const MAX_SCALE = 5;

    // ---------- 辅助函数 ----------
    function getRect(el) {
        if (!el) return { top: 0, left: 0, width: 0, height: 0 };
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
    }

    function getFinalSize(naturalWidth, naturalHeight, viewportW, viewportH) {
        const maxWidth = viewportW * 0.85;
        const maxHeight = viewportH * 0.85;
        let finalWidth = naturalWidth;
        let finalHeight = naturalHeight;
        if (finalWidth > maxWidth) {
            const ratio = maxWidth / finalWidth;
            finalWidth = maxWidth;
            finalHeight *= ratio;
        }
        if (finalHeight > maxHeight) {
            const ratio = maxHeight / finalHeight;
            finalHeight = maxHeight;
            finalWidth *= ratio;
        }
        return { width: finalWidth, height: finalHeight };
    }

    function getCenterPosition(finalWidth, finalHeight, viewportW, viewportH) {
        return { left: (viewportW - finalWidth) / 2, top: (viewportH - finalHeight) / 2 };
    }

    // 重置图片变换（带动画）
    function resetTransform() {
        if (!cloneImg) return;
        if (isResetting) return;
        if (isDragging) {
            isDragging = false;
            if (cloneImg) cloneImg.style.cursor = 'pointer';
        }

        isResetting = true;
        cloneImg.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1)';
        
        scale = 1;
        translate = { x: 0, y: 0 };
        applyTransform();

        const onResetEnd = () => {
            cloneImg.removeEventListener('transitionend', onResetEnd);
            cloneImg.style.transition = '';
            isResetting = false;
            clampTranslate();
        };
        cloneImg.addEventListener('transitionend', onResetEnd, { once: true });
        
        setTimeout(() => {
            if (isResetting) {
                cloneImg.removeEventListener('transitionend', onResetEnd);
                cloneImg.style.transition = '';
                isResetting = false;
                clampTranslate();
            }
        }, 350);
    }

    function applyTransform() {
        if (!cloneImg) return;
        cloneImg.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`;
        cloneImg.style.transformOrigin = 'center center';
    }

    function clampTranslate() {
        if (!cloneImg) return;
        const rect = cloneImg.getBoundingClientRect();
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const maxX = Math.max(0, (rect.width - viewportW) / 2);
        const maxY = Math.max(0, (rect.height - viewportH) / 2);
        translate.x = Math.min(maxX, Math.max(-maxX, translate.x));
        translate.y = Math.min(maxY, Math.max(-maxY, translate.y));
        applyTransform();
    }

    // 滚轮缩放
    function onWheel(e) {
        if (!activeLightbox || isAnimating || isResetting) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        let newScale = scale * delta;
        newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
        if (newScale === scale) return;

        const rect = cloneImg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const ratioX = mouseX / rect.width;
        const ratioY = mouseY / rect.height;

        scale = newScale;
        applyTransform();

        const newRect = cloneImg.getBoundingClientRect();
        const deltaX = newRect.width * ratioX - rect.width * ratioX;
        const deltaY = newRect.height * ratioY - rect.height * ratioY;
        translate.x -= deltaX;
        translate.y -= deltaY;
        clampTranslate();
        applyTransform();
    }

    // 拖拽
    function onPointerDown(e) {
        if (!activeLightbox || isAnimating || scale === 1 || isResetting) return;
        e.preventDefault();
        isDragging = true;
        const point = e.touches ? e.touches[0] : e;
        dragStart.x = point.clientX - translate.x;
        dragStart.y = point.clientY - translate.y;
        cloneImg.style.cursor = 'grabbing';
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const point = e.touches ? e.touches[0] : e;
        translate.x = point.clientX - dragStart.x;
        translate.y = point.clientY - dragStart.y;
        clampTranslate();
        applyTransform();
    }

    function onPointerUp() {
        isDragging = false;
        if (cloneImg) cloneImg.style.cursor = scale === 1 ? 'pointer' : 'grab';
    }

    // 双指缩放
    function onTouchStart(e) {
        if (isResetting) return;
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            initialDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            initialScale = scale;
            lastTouchCount = 2;
        } else if (e.touches.length === 1) {
            onPointerDown(e);
        }
    }

    function onTouchMove(e) {
        if (e.touches.length === 2 && initialDistance > 0) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            let newScale = initialScale * (distance / initialDistance);
            newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
            if (newScale !== scale) {
                const rect = cloneImg.getBoundingClientRect();
                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                const ratioX = (centerX - rect.left) / rect.width;
                const ratioY = (centerY - rect.top) / rect.height;
                const oldWidth = rect.width;
                const oldHeight = rect.height;
                scale = newScale;
                applyTransform();
                const newRect = cloneImg.getBoundingClientRect();
                const deltaX = (newRect.width - oldWidth) * ratioX;
                const deltaY = (newRect.height - oldHeight) * ratioY;
                translate.x -= deltaX;
                translate.y -= deltaY;
                clampTranslate();
                applyTransform();
            }
        } else if (e.touches.length === 1) {
            onPointerMove(e);
        }
    }

    function onTouchEnd(e) {
        if (e.touches.length < 2) {
            initialDistance = 0;
            lastTouchCount = 0;
        }
        if (e.touches.length === 0) {
            onPointerUp();
        }
    }

    // 移动端双击检测（模拟双击）
    function onTouchStartForDoubleTap(e) {
        if (isResetting) return;
        const now = Date.now();
        const timeSinceLast = now - lastTap;
        if (timeSinceLast < 300 && timeSinceLast > 0) {
            // 检测到双击
            e.preventDefault();
            e.stopPropagation();
            if (isDragging) {
                isDragging = false;
                if (cloneImg) cloneImg.style.cursor = 'pointer';
            }
            resetTransform();
            lastTap = 0;
            if (tapTimer) clearTimeout(tapTimer);
        } else {
            lastTap = now;
            if (tapTimer) clearTimeout(tapTimer);
            tapTimer = setTimeout(() => { lastTap = 0; }, 300);
        }
    }

    // 桌面端双击
    function onDoubleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        if (isResetting) return;
        if (isDragging) {
            isDragging = false;
            if (cloneImg) cloneImg.style.cursor = 'pointer';
        }
        resetTransform();
    }

    // 绑定事件
    function bindZoomEvents() {
        if (!cloneImg) return;
        cloneImg.addEventListener('wheel', onWheel, { passive: false });
        cloneImg.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);
        
        // 触摸事件顺序：先检测双击，再处理单指/双指
        cloneImg.addEventListener('touchstart', onTouchStartForDoubleTap, { passive: false });
        cloneImg.addEventListener('touchstart', onTouchStart, { passive: false });
        cloneImg.addEventListener('touchmove', onTouchMove, { passive: false });
        cloneImg.addEventListener('touchend', onTouchEnd);
        cloneImg.addEventListener('touchcancel', onTouchEnd);
        
        cloneImg.addEventListener('dblclick', onDoubleClick);
        cloneImg.style.cursor = 'pointer';
    }

    function unbindZoomEvents() {
        if (!cloneImg) return;
        cloneImg.removeEventListener('wheel', onWheel);
        cloneImg.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        cloneImg.removeEventListener('touchstart', onTouchStartForDoubleTap);
        cloneImg.removeEventListener('touchstart', onTouchStart);
        cloneImg.removeEventListener('touchmove', onTouchMove);
        cloneImg.removeEventListener('touchend', onTouchEnd);
        cloneImg.removeEventListener('touchcancel', onTouchEnd);
        cloneImg.removeEventListener('dblclick', onDoubleClick);
        if (tapTimer) clearTimeout(tapTimer);
        lastTap = 0;
    }

    // ---------- 灯箱核心（打开/关闭） ----------
    function destroyLightboxDom() {
        if (lightboxElement && lightboxElement.parentNode) {
            lightboxElement.parentNode.removeChild(lightboxElement);
        }
        if (closeBtn && closeBtn.parentNode) {
            closeBtn.parentNode.removeChild(closeBtn);
        }
        lightboxElement = null;
        cloneImg = null;
        closeBtn = null;
    }

function resetLightboxState() {
    activeLightbox = false;
    isAnimating = false;
    originalImgRef = null;
    
    // 强制恢复页面滚动（无论之前保存的值是什么）
    document.body.style.overflow = '';
    originalOverflow = '';
    
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    if (escHandler) window.removeEventListener('keydown', escHandler);
    resizeHandler = null;
    escHandler = null;
    scale = 1;
    translate = { x: 0, y: 0 };
    isDragging = false;
    isResetting = false;
    if (tapTimer) clearTimeout(tapTimer);
    lastTap = 0;
}

    function closeLightbox(skipAnimation = false) {
        if (!activeLightbox && !lightboxElement) return;
        if (isAnimating && !skipAnimation) return;

        if (resizeHandler) window.removeEventListener('resize', resizeHandler);
        if (escHandler) window.removeEventListener('keydown', escHandler);
        unbindZoomEvents();

        if (!lightboxElement || !cloneImg || !originalImgRef) {
            destroyLightboxDom();
            resetLightboxState();
            return;
        }

        if (skipAnimation) {
            destroyLightboxDom();
            resetLightboxState();
            return;
        }

        const startRect = getRect(originalImgRef);
        if (startRect.width === 0 || startRect.height === 0) {
            destroyLightboxDom();
            resetLightboxState();
            return;
        }

        isAnimating = true;
        const onCloseTransitionEnd = (e) => {
            if (e.target !== cloneImg) return;
            cloneImg.removeEventListener('transitionend', onCloseTransitionEnd);
            destroyLightboxDom();
            resetLightboxState();
            isAnimating = false;
        };
        cloneImg.addEventListener('transitionend', onCloseTransitionEnd);

        cloneImg.style.transition = 'all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1)';
        cloneImg.style.transform = 'translate(0,0) scale(1)';
        cloneImg.style.top = startRect.top + 'px';
        cloneImg.style.left = startRect.left + 'px';
        cloneImg.style.width = startRect.width + 'px';
        cloneImg.style.height = startRect.height + 'px';

        if (closeBtn) closeBtn.style.opacity = '0';
        if (lightboxElement) {
            lightboxElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            lightboxElement.style.backdropFilter = 'blur(0px)';
        }
    }

    function openLightbox(imgElement) {
        if (activeLightbox || isAnimating) return;
        if (!imgElement || !imgElement.src) return;

        const naturalWidth = imgElement.naturalWidth;
        const naturalHeight = imgElement.naturalHeight;
        if (naturalWidth === 0 || naturalHeight === 0) {
            imgElement.addEventListener('load', function onLoad() {
                imgElement.removeEventListener('load', onLoad);
                openLightbox(imgElement);
            });
            return;
        }

        originalImgRef = imgElement;
        const startRect = getRect(imgElement);
        if (startRect.width === 0) return;

        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        const { width: finalWidth, height: finalHeight } = getFinalSize(naturalWidth, naturalHeight, viewportW, viewportH);
        const { left: finalLeft, top: finalTop } = getCenterPosition(finalWidth, finalHeight, viewportW, viewportH);

        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            backdrop-filter: blur(0px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-tap-highlight-color: transparent;
            transition: background-color 0.35s ease, backdrop-filter 0.3s ease;
            cursor: pointer;
        `;

        const btnClose = document.createElement('div');
        btnClose.className = 'lightbox-close-btn';
        btnClose.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"><path fill="none" opacity="0.5" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" data-swindex="0" d="M12 12L7 7m5 5l5 5m-5-5l5-5m-5 5l-5 5"></path></svg>';
        btnClose.style.cssText = `
	position: fixed;
	top: 24px;
	right: 28px;
   	width: 44px;
	height: 44px;
	background: rgba(0, 0, 0, .5);
	backdrop-filter: blur(8px);
	border-radius: 50%;
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	color: #ffffffa8;
    	cursor: pointer;
    	z-index: 10002;
                padding: 5px;
    	transition: opacity 0.2s, transform 0.2s;
    	opacity: 1;
    	box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px;
    	border: 1px solid rgba(200, 200, 200, 0.05);
	-webkit-tap-highlight-color: transparent;
        `;

        const cloneImage = document.createElement('img');
        cloneImage.className = 'lightbox-clone-img';
        cloneImage.src = imgElement.src;
        cloneImage.alt = imgElement.alt || '';
        cloneImage.style.cssText = `
            position: fixed;
            top: ${startRect.top}px;
            left: ${startRect.left}px;
            width: ${startRect.width}px;
            height: ${startRect.height}px;
            object-fit: contain;
            will-change: transform, width, height, top, left;
            transition: all 0.42s cubic-bezier(0.2, 0.9, 0.4, 1);
            z-index: 10001;
            border-radius: 12px;
            box-shadow: 0 25px 40px rgba(0,0,0,0.3);
            cursor: pointer;
            background-color: rgba(0,0,0,0.05);
        `;

        overlay.appendChild(cloneImage);
        document.body.appendChild(overlay);
        document.body.appendChild(btnClose);

        lightboxElement = overlay;
        cloneImg = cloneImage;
        closeBtn = btnClose;

        originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        cloneImg.getBoundingClientRect();
        requestAnimationFrame(() => {
            cloneImg.style.top = finalTop + 'px';
            cloneImg.style.left = finalLeft + 'px';
            cloneImg.style.width = finalWidth + 'px';
            cloneImg.style.height = finalHeight + 'px';
            cloneImg.style.borderRadius = '20px';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            overlay.style.backdropFilter = 'blur(12px)';
            btnClose.style.opacity = '1';
        });

        const onOpenEnd = () => {
            if (cloneImg) cloneImg.removeEventListener('transitionend', onOpenEnd);
            isAnimating = false;
            activeLightbox = true;
            bindZoomEvents();
            resetTransform();
        };
        cloneImg.addEventListener('transitionend', onOpenEnd, { once: true });
        setTimeout(() => {
            if (cloneImg && !activeLightbox) {
                activeLightbox = true;
                isAnimating = false;
                bindZoomEvents();
                resetTransform();
            }
        }, 450);

        activeLightbox = true;
        isAnimating = true;

        const handleOverlayClick = (e) => {
            if (!activeLightbox || isAnimating) return;
            if (e.target === overlay) {
                e.stopPropagation();
                closeLightbox(false);
            }
        };
        overlay.addEventListener('click', handleOverlayClick);

        const handleCloseClick = (e) => {
            e.stopPropagation();
            if (!activeLightbox || isAnimating) return;
            closeLightbox(false);
        };
        btnClose.addEventListener('click', handleCloseClick);

        const handleKeydown = (e) => {
            if (e.key === 'Escape' && activeLightbox && !isAnimating) {
                e.preventDefault();
                closeLightbox(false);
            }
        };
        window.addEventListener('keydown', handleKeydown);
        escHandler = handleKeydown;

        const handleResize = () => {
            if (activeLightbox && !isAnimating) closeLightbox(true);
        };
        window.addEventListener('resize', handleResize);
        resizeHandler = handleResize;
    }

    function initLightbox(selector = '.lightbox-img') {
        const handleGlobalClick = (e) => {
            const img = e.target.closest(selector);
            if (img && img.tagName === 'IMG' && !activeLightbox && !isAnimating) {
                e.preventDefault();
                openLightbox(img);
            }
        };
        document.body.addEventListener('click', handleGlobalClick);
        return function destroy() {
            document.body.removeEventListener('click', handleGlobalClick);
        };
    }

    global.Lightbox = {
        init: initLightbox,
        open: openLightbox,
        close: closeLightbox,
    };
})(window);
