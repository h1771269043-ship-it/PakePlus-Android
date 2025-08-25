// ==UserScript==
// @name         叔叔不约只配女
// @namespace    yeyu
// @version      0.7
// @description  叔叔不约只配女，你懂我的意思吧
// @author       夜雨
// @match        *://*.shushubuyue.net/*
// @match        *://*.shushubuyue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shushubuyue.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456928/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/456928/%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E5%8F%AA%E9%85%8D%E5%A5%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置
    let config = {
        enabled: true,
        contactInfo: '这是我的联系方式',
        greeting1: '你好啊',
        greeting2: '很高兴认识你'
    };

    // 尝试从本地存储加载配置
    try {
        const savedConfig = localStorage.getItem('shushubuyue_config');
        if (savedConfig) {
            config = {...config, ...JSON.parse(savedConfig)};
        }
    } catch (e) {
        console.log('加载配置失败', e);
    }

    // 保存配置到本地存储
    function saveConfig() {
        try {
            localStorage.setItem('shushubuyue_config', JSON.stringify(config));
        } catch (e) {
            console.log('保存配置失败', e);
        }
    }

    // 创建悬浮按钮
    function createFloatingButtons() {
        // 创建三角形控制按钮
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'shushubuyue-toggle';
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.top = '25px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.width = '0';
        toggleBtn.style.height = '0';
        // 修改为朝右的三角形
        toggleBtn.style.borderTop = '6px solid transparent';  // 调整为原来的20%
        toggleBtn.style.borderBottom = '6px solid transparent';  // 调整为原来的20%
        toggleBtn.style.borderLeft = '12px solid rgba(255, 255, 255, 0.5)';  // 调整为原来的20%
        toggleBtn.style.borderRight = 'none';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.zIndex = '9999';
        toggleBtn.title = '点击开关脚本，长按配置';

        // 创建发送联系方式按钮
        const contactBtn = document.createElement('div');
        contactBtn.id = 'shushubuyue-contact';
        contactBtn.textContent = '发送联系方式';
        contactBtn.style.position = 'fixed';
        contactBtn.style.top = '70px';
        contactBtn.style.right = '20px';
        contactBtn.style.padding = '8px 12px';
        contactBtn.style.backgroundColor = '#4CAF50';
        contactBtn.style.color = 'white';
        contactBtn.style.borderRadius = '4px';
        contactBtn.style.cursor = 'pointer';
        contactBtn.style.zIndex = '9999';
        contactBtn.style.fontSize = '14px';
        contactBtn.style.display = config.enabled ? 'block' : 'none';

        // 添加按钮到页面
        document.body.appendChild(toggleBtn);
        document.body.appendChild(contactBtn);

        // 按钮事件处理
        let longPressTimer;
        const longPressDuration = 1000; // 长按1秒触发配置

        toggleBtn.addEventListener('mousedown', function() {
            longPressTimer = setTimeout(showConfigPanel, longPressDuration);
        });

        toggleBtn.addEventListener('mouseup', function() {
            clearTimeout(longPressTimer);
        });

        toggleBtn.addEventListener('mouseleave', function() {
            clearTimeout(longPressTimer);
        });

        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(longPressTimer);
            toggleScript();
        });

        contactBtn.addEventListener('click', function() {
            sendContactInfo();
        });
    }

    // 开关脚本
    function toggleScript() {
        config.enabled = !config.enabled;
        saveConfig();
        
        // 更新按钮显示
        const contactBtn = document.getElementById('shushubuyue-contact');
        if (contactBtn) {
            contactBtn.style.display = config.enabled ? 'block' : 'none';
        }
        
        // 更新三角形按钮颜色
        const toggleBtn = document.getElementById('shushubuyue-toggle');
        if (toggleBtn) {
            toggleBtn.style.borderLeftColor = config.enabled ? 
                'rgba(255, 255, 255, 0.5)' : 'rgba(255, 0, 0, 0.5)';
        }
        
        // 如果关闭脚本，停止所有自动操作
        if (!config.enabled) {
            firstAuto = true;
        }
    }

    // 发送联系方式（分开发送，一次三位）
    function sendContactInfo() {
        if (!config.enabled) return;
        
        try {
            const msgInput = document.querySelector("#msgInput");
            const sendButton = document.querySelector(".button-link.msg-send");
            
            if (!msgInput || !sendButton) return;
            
            const contactText = config.contactInfo;
            const chunkSize = 3; // 每次发送3个字符
            
            // 分段发送联系方式
            for (let i = 0; i < contactText.length; i += chunkSize) {
                const chunk = contactText.substring(i, i + chunkSize);
                
                // 使用setTimeout延迟发送，确保按顺序发送
                setTimeout(() => {
                    msgInput.value = chunk;
                    msgInput.dispatchEvent(new Event('input'));
                    msgInput.dispatchEvent(new Event('change'));
                    sendButton.click();
                }, i * 500); // 每段间隔500毫秒
            }
        } catch (e) {
            console.log('发送联系方式失败', e);
        }
    }

    // 显示配置面板
    function showConfigPanel() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'shushubuyue-config-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        // 创建配置面板
        const panel = document.createElement('div');
        panel.style.backgroundColor = '#222';
        panel.style.padding = '20px';
        panel.style.borderRadius = '8px';
        panel.style.width = '300px';
        panel.style.color = 'white';

        // 面板标题
        const title = document.createElement('h3');
        title.textContent = '叔叔不约配置';
        title.style.marginTop = '0';
        title.style.textAlign = 'center';
        panel.appendChild(title);

        // 联系方式输入框
        const contactLabel = document.createElement('label');
        contactLabel.textContent = '联系方式:';
        contactLabel.style.display = 'block';
        contactLabel.style.marginBottom = '5px';
        panel.appendChild(contactLabel);

        const contactInput = document.createElement('input');
        contactInput.type = 'text';
        contactInput.value = config.contactInfo;
        contactInput.style.width = '100%';
        contactInput.style.padding = '8px';
        contactInput.style.marginBottom = '15px';
        contactInput.style.boxSizing = 'border-box';
        contactInput.style.color = 'black';
        contactInput.style.backgroundColor = 'white';
        panel.appendChild(contactInput);

        // 打招呼语句1输入框
        const greeting1Label = document.createElement('label');
        greeting1Label.textContent = '打招呼语句1:';
        greeting1Label.style.display = 'block';
        greeting1Label.style.marginBottom = '5px';
        panel.appendChild(greeting1Label);

        const greeting1Input = document.createElement('input');
        greeting1Input.type = 'text';
        greeting1Input.value = config.greeting1;
        greeting1Input.style.width = '100%';
        greeting1Input.style.padding = '8px';
        greeting1Input.style.marginBottom = '15px';
        greeting1Input.style.boxSizing = 'border-box';
        greeting1Input.style.color = 'black';
        greeting1Input.style.backgroundColor = 'white';
        panel.appendChild(greeting1Input);

        // 打招呼语句2输入框
        const greeting2Label = document.createElement('label');
        greeting2Label.textContent = '打招呼语句2:';
        greeting2Label.style.display = 'block';
        greeting2Label.style.marginBottom = '5px';
        panel.appendChild(greeting2Label);

        const greeting2Input = document.createElement('input');
        greeting2Input.type = 'text';
        greeting2Input.value = config.greeting2;
        greeting2Input.style.width = '100%';
        greeting2Input.style.padding = '8px';
        greeting2Input.style.marginBottom = '20px';
        greeting2Input.style.boxSizing = 'border-box';
        greeting2Input.style.color = 'black';
        greeting2Input.style.backgroundColor = 'white';
        panel.appendChild(greeting2Input);

        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存配置';
        saveBtn.style.width = '100%';
        saveBtn.style.padding = '10px';
        saveBtn.style.backgroundColor = '#4CAF50';
        saveBtn.style.color = 'white';
        saveBtn.style.border = 'none';
        saveBtn.style.borderRadius = '4px';
        saveBtn.style.cursor = 'pointer';
        saveBtn.onclick = function() {
            config.contactInfo = contactInput.value;
            config.greeting1 = greeting1Input.value;
            config.greeting2 = greeting2Input.value;
            saveConfig();
            document.body.removeChild(overlay);
        };
        panel.appendChild(saveBtn);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.width = '100%';
        closeBtn.style.padding = '10px';
        closeBtn.style.backgroundColor = '#f44336';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.marginTop = '10px';
        closeBtn.onclick = function() {
            document.body.removeChild(overlay);
        };
        panel.appendChild(closeBtn);

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // 点击遮罩层关闭
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // 随机选择问候语（50%概率选择第一条，50%概率选择第二条）
    function getRandomGreeting() {
        return Math.random() < 0.5 ? config.greeting1 : config.greeting2;
    }

    // 原脚本功能
    let firstAuto = true;

    function leave() {
        var leftButton = document.querySelector("a.button-link.chat-control");
        if (leftButton) leftButton.click()
        var leftSecondButton = document.querySelector(
            "span.actions-modal-button.actions-modal-button-bold.color-danger")
        if (leftSecondButton) leftSecondButton.click()

        var restartButton = document.querySelector("span.chat-control")
        if (restartButton && restartButton.innerText) {
            if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
                restartButton.click()
                setTimeout(function () {
                    restartButton.click()
                }, 500)
            } else if (typeof restartButton.innerText == "string" && restartButton.innerText == "重新开始") {
                restartButton.click()
            } else {
                console.log("error restartButton")
            }
        }
    }

    function init() {
        createFloatingButtons();
        
        setInterval(() => {
            if (!config.enabled) return;
            
            var tab = document.querySelector("#partnerInfoText")
            if (tab) var tabText = tab.innerText
            if (tabText && typeof tabText == 'string' && tabText.indexOf("女生") != -1) {
                //女生

                var restartButton = document.querySelector("span.chat-control")
                if (restartButton && restartButton.innerText) {
                    if (typeof restartButton.innerText == "string" && restartButton.innerText == "离开") {
                        restartButton.click()
                        setTimeout(function () {
                            restartButton.click()
                        }, 500)
                    } else if (typeof restartButton.innerText == "string" && restartButton.innerText ==
                        "重新开始") {
                        restartButton.click()
                    } else {
                        //console.log("error restartButton")
                    }
                }

                if (firstAuto) {
                    firstAuto = false

                    setTimeout((ev) => {
                        var msgInput = document.querySelector("#msgInput")
                        // 随机选择问候语
                        msgInput.value = getRandomGreeting();
                        msgInput.dispatchEvent(new Event('input'))
                        msgInput.dispatchEvent(new Event('change'))
                        document.querySelector(".button-link.msg-send").click()
                    }, 1000)
                }
            }

            if (tabText && typeof tabText == 'string' && tabText.indexOf("男生") != -1) {
                firstAuto = true
                //男生
                leave()
            }
        }, 1000)
    }

    setTimeout(init, 5000)
})();