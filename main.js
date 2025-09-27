// Main JavaScript for ODFL Benchmark Analysis
class ODFLAnalytics {
    constructor() {
        this.charts = {};
        this.animations = {};
        this.init();
    }

    init() {
        this.setupParticleBackground();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.initializeCharts();
        this.setupProgressBar();
        this.setupSmoothScrolling();
    }

    // Particle Background Animation
    setupParticleBackground() {
        const sketch = (p) => {
            let particles = [];
            const numParticles = 80;

            p.setup = () => {
                const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                canvas.parent('particleCanvas');
                
                for (let i = 0; i < numParticles; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        size: p.random(1, 4),
                        speedX: p.random(-0.3, 0.3),
                        speedY: p.random(-0.3, 0.3),
                        opacity: p.random(0.1, 0.6),
                        pulse: p.random(0.01, 0.03),
                        phase: p.random(p.TWO_PI)
                    });
                }
            };

            p.draw = () => {
                p.clear();
                
                // Create connections between nearby particles
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (dist < 100) {
                            const alpha = p.map(dist, 0, 100, 0.3, 0);
                            p.stroke(255, 255, 255, alpha * 255);
                            p.strokeWeight(0.5);
                            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        }
                    }
                }
                
                // Draw particles with pulsing effect
                particles.forEach(particle => {
                    const pulseSize = particle.size + p.sin(particle.phase) * 2;
                    const pulseOpacity = particle.opacity + p.sin(particle.phase) * 0.2;
                    
                    p.fill(255, 255, 255, pulseOpacity * 255);
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, pulseSize);
                    
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.phase += particle.pulse;
                    
                    // Wrap around screen
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };
        };

        new p5(sketch);
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.id === 'heroTitle') {
                        anime({
                            targets: '#heroTitle',
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 1000,
                            easing: 'easeOutExpo'
                        });
                    }
                    
                    if (element.id === 'heroSubtitle') {
                        anime({
                            targets: '#heroSubtitle',
                            opacity: [0, 1],
                            translateY: [30, 0],
                            duration: 1000,
                            delay: 300,
                            easing: 'easeOutExpo'
                        });
                    }
                    
                    if (element.id === 'heroStats') {
                        anime({
                            targets: '#heroStats',
                            opacity: [0, 1],
                            translateY: [30, 0],
                            duration: 1000,
                            delay: 600,
                            easing: 'easeOutExpo'
                        });
                    }
                    
                    if (element.id === 'heroImage') {
                        anime({
                            targets: '#heroImage',
                            opacity: [0, 1],
                            scale: [0.8, 1],
                            duration: 1000,
                            delay: 900,
                            easing: 'easeOutExpo'
                        });
                    }
                    
                    if (element.id === 'heroButton') {
                        anime({
                            targets: '#heroButton',
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 800,
                            delay: 1200,
                            easing: 'easeOutExpo'
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe hero elements
        ['heroTitle', 'heroSubtitle', 'heroStats', 'heroImage', 'heroButton'].forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        // Observe cards
        document.querySelectorAll('.card-hover').forEach((card, index) => {
            observer.observe(card);
            
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.05,
                    rotateX: 5,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    rotateX: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    // Counter Animations
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.number-counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const isPercentage = counter.textContent.includes('%');
                    const isCurrency = target > 1000;
                    
                    anime({
                        targets: counter,
                        innerHTML: [0, target],
                        duration: 2000,
                        easing: 'easeOutExpo',
                        round: 1,
                        update: function(anim) {
                            const value = Math.round(anim.animatables[0].target.innerHTML);
                            if (isPercentage) {
                                counter.innerHTML = `${value}%`;
                            } else if (isCurrency) {
                                counter.innerHTML = `$${value}M`;
                            } else {
                                counter.innerHTML = value;
                            }
                        }
                    });
                    
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            if (counter.dataset.target) {
                counterObserver.observe(counter);
            }
        });
    }

    // Initialize Charts
    initializeCharts() {
        this.initCostBreakdownChart();
        this.initSegmentChart();
        this.initSankeyChart();
        this.initLineHaulChart();
        this.initPDChart();
        this.initDockChart();
    }

    initCostBreakdownChart() {
        const chartDom = document.getElementById('costBreakdownChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: <strong>${c}M</strong> ({d}%)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#2D5016',
                borderWidth: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 14
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'center',
                textStyle: {
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: '#333'
                },
                itemGap: 20,
                icon: 'circle'
            },
            series: [
                {
                    name: 'Costos Operativos',
                    type: 'pie',
                    radius: ['45%', '80%'],
                    center: ['65%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 15,
                        borderColor: '#fff',
                        borderWidth: 4,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#2D5016'
                        },
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(45, 80, 22, 0.3)'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { 
                            value: 1717.5, 
                            name: 'Line Haul', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#2D5016' },
                                    { offset: 1, color: '#4A7C59' }
                                ])
                            }
                        },
                        { 
                            value: 1252.5, 
                            name: 'P&D Operations', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#4A7C59' },
                                    { offset: 1, color: '#8FBC8F' }
                                ])
                            }
                        },
                        { 
                            value: 608.5, 
                            name: 'Dock Operations', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#8FBC8F' },
                                    { offset: 1, color: '#A8D8A8' }
                                ])
                            }
                        },
                        { 
                            value: 645.0, 
                            name: 'SG&A', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#F39C12' },
                                    { offset: 1, color: '#FBBF24' }
                                ])
                            }
                        }
                    ],
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 200;
                    }
                }
            ]
        };

        myChart.setOption(option);
        this.charts.costBreakdown = myChart;
    }

    initSegmentChart() {
        const chartDom = document.getElementById('segmentChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    shadowStyle: {
                        color: 'rgba(45, 80, 22, 0.1)'
                    }
                },
                formatter: function(params) {
                    return `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].name}</div>` +
                           `<div style="color: #2D5016;">${params[0].seriesName}: <strong>$${params[0].value}M</strong></div>`;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#2D5016',
                borderWidth: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 13
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: ['Line Haul', 'P&D Ops', 'Dock Ops', 'SG&A'],
                axisLabel: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: '#333'
                },
                axisLine: {
                    lineStyle: {
                        color: '#e5e7eb'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '${value}M',
                    fontSize: 11,
                    color: '#666'
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: '#f3f4f6',
                        type: 'dashed'
                    }
                }
            },
            series: [
                {
                    name: 'Costo Total',
                    type: 'bar',
                    data: [
                        { 
                            value: 1717.5, 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#2D5016' },
                                    { offset: 1, color: '#4A7C59' }
                                ]),
                                borderRadius: [8, 8, 0, 0]
                            }
                        },
                        { 
                            value: 1252.5, 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#4A7C59' },
                                    { offset: 1, color: '#8FBC8F' }
                                ]),
                                borderRadius: [8, 8, 0, 0]
                            }
                        },
                        { 
                            value: 608.5, 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#8FBC8F' },
                                    { offset: 1, color: '#A8D8A8' }
                                ]),
                                borderRadius: [8, 8, 0, 0]
                            }
                        },
                        { 
                            value: 645.0, 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#F39C12' },
                                    { offset: 1, color: '#FBBF24' }
                                ]),
                                borderRadius: [8, 8, 0, 0]
                            }
                        }
                    ],
                    barWidth: '65%',
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 15,
                            shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    animationDelay: function (idx) {
                        return idx * 100;
                    }
                }
            ]
        };

        myChart.setOption(option);
        this.charts.segment = myChart;
    }

    initSankeyChart() {
        const chartDom = document.getElementById('sankeyChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function(params) {
                    if (params.dataType === 'edge') {
                        return `<div style="font-weight: bold;">Flujo de Recursos</div>` +
                               `<div>${params.data.source} → ${params.data.target}</div>` +
                               `<div style="color: #2D5016; font-size: 16px;"><strong>$${params.data.value}M</strong></div>`;
                    } else {
                        return `<div style="font-weight: bold;">${params.name}</div>`;
                    }
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#2D5016',
                borderWidth: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 13
                }
            },
            series: [
                {
                    type: 'sankey',
                    data: [
                        { 
                            name: 'Ingresos Totales',
                            itemStyle: { color: '#2D5016' }
                        },
                        { 
                            name: 'Gastos Operativos',
                            itemStyle: { color: '#4A7C59' }
                        },
                        { 
                            name: 'Utilidad Operativa',
                            itemStyle: { color: '#F39C12' }
                        },
                        { 
                            name: 'Line Haul',
                            itemStyle: { color: '#2D5016' }
                        },
                        { 
                            name: 'P&D Operations',
                            itemStyle: { color: '#4A7C59' }
                        },
                        { 
                            name: 'Dock Operations',
                            itemStyle: { color: '#8FBC8F' }
                        },
                        { 
                            name: 'SG&A',
                            itemStyle: { color: '#F39C12' }
                        }
                    ],
                    links: [
                        { source: 'Ingresos Totales', target: 'Gastos Operativos', value: 4223.5 },
                        { source: 'Ingresos Totales', target: 'Utilidad Operativa', value: 1642.5 },
                        { source: 'Gastos Operativos', target: 'Line Haul', value: 1717.5 },
                        { source: 'Gastos Operativos', target: 'P&D Operations', value: 1252.5 },
                        { source: 'Gastos Operativos', target: 'Dock Operations', value: 608.5 },
                        { source: 'Gastos Operativos', target: 'SG&A', value: 645.0 }
                    ],
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 2,
                        shadowBlur: 5,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.5,
                        opacity: 0.7
                    },
                    label: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    emphasis: {
                        focus: 'adjacency',
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    animationDuration: 2000,
                    animationEasing: 'cubicOut'
                }
            ]
        };

        myChart.setOption(option);
        this.charts.sankey = myChart;
    }

    initLineHaulChart() {
        const chartDom = document.getElementById('lineHaulChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return `<div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>` +
                           `<div style="color: #2D5016;">Costo: <strong>$${params.value}M</strong> (${params.percent}%)</div>`;
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#2D5016',
                borderWidth: 1,
                textStyle: {
                    color: '#333',
                    fontSize: 13
                }
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '75%'],
                    center: ['50%', '50%'],
                    data: [
                        { 
                            value: 750.0, 
                            name: 'Salarios y Beneficios', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#2D5016' },
                                    { offset: 1, color: '#4A7C59' }
                                ])
                            }
                        },
                        { 
                            value: 580.0, 
                            name: 'Combustible', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#4A7C59' },
                                    { offset: 1, color: '#8FBC8F' }
                                ])
                            }
                        },
                        { 
                            value: 210.0, 
                            name: 'Mantenimiento', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#8FBC8F' },
                                    { offset: 1, color: '#A8D8A8' }
                                ])
                            }
                        },
                        { 
                            value: 110.0, 
                            name: 'Depreciación', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#A8D8A8' },
                                    { offset: 1, color: '#C8E6C9' }
                                ])
                            }
                        },
                        { 
                            value: 67.5, 
                            name: 'Peajes y Permisos', 
                            itemStyle: { 
                                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                                    { offset: 0, color: '#F39C12' },
                                    { offset: 1, color: '#FBBF24' }
                                ])
                            }
                        }
                    ],
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 3,
                        shadowBlur: 5,
                        shadowColor: 'rgba(0, 0, 0, 0.1)'
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: '#333',
                        formatter: '{b}\n{c}M ({d}%)'
                    },
                    labelLine: {
                        show: true,
                        lineStyle: {
                            color: '#666'
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 15,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.3)'
                        },
                        label: {
                            fontSize: 13,
                            color: '#2D5016'
                        }
                    },
                    animationType: 'scale',
                    animationEasing: 'elasticOut',
                    animationDelay: function (idx) {
                        return Math.random() * 300;
                    }
                }
            ]
        };

        myChart.setOption(option);
        this.charts.lineHaul = myChart;
    }

    initPDChart() {
        const chartDom = document.getElementById('pdChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: ${c}M ({d}%)'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '70%'],
                    data: [
                        { value: 680.0, name: 'Salarios y Beneficios', itemStyle: { color: '#1E40AF' } },
                        { value: 230.0, name: 'Combustible', itemStyle: { color: '#3B82F6' } },
                        { value: 190.0, name: 'Mantenimiento', itemStyle: { color: '#60A5FA' } },
                        { value: 90.0, name: 'Depreciación', itemStyle: { color: '#93C5FD' } },
                        { value: 62.5, name: 'Seguros', itemStyle: { color: '#F39C12' } }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
        this.charts.pd = myChart;
    }

    initDockChart() {
        const chartDom = document.getElementById('dockChart');
        if (!chartDom) return;
        
        const myChart = echarts.init(chartDom);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: ${c}M ({d}%)'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['30%', '70%'],
                    data: [
                        { value: 350.0, name: 'Salarios y Beneficios', itemStyle: { color: '#EA580C' } },
                        { value: 110.0, name: 'Alquiler y Gastos', itemStyle: { color: '#F97316' } },
                        { value: 85.0, name: 'Mantenimiento Equipo', itemStyle: { color: '#FB923C' } },
                        { value: 63.5, name: 'Supervisión', itemStyle: { color: '#FDBA74' } }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
        this.charts.dock = myChart;
    }

    // Progress Bar
    setupProgressBar() {
        const progressBar = document.getElementById('progressBar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Hero button scroll
        const heroButton = document.getElementById('heroButton');
        if (heroButton) {
            heroButton.addEventListener('click', () => {
                document.getElementById('overview').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }

    // Resize handler for charts
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const analytics = new ODFLAnalytics();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        analytics.handleResize();
    });
    
    // Add loading animation
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutExpo'
    });
});

// Export for potential external use
window.ODFLAnalytics = ODFLAnalytics;