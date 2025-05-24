
import './Carousel.css'
import { useState, Children, useEffect, useRef } from 'react'
import { Page } from './CarouselPage/CarPage'
import { CarouselContext } from './CarouselContext'

export default function Carousel({ children }) {
    const [pages, setPages] = useState([])
    const [offset, setOffset] = useState(0)
    const [width, setWidth] = useState(450)
    const windowElementRef = useRef(null)

    useEffect(() => {

        const resizeHandler = () => {
            const _width =  windowElementRef.current.offsetWidth
            setWidth(_width)
            setOffset(0)
        }
        resizeHandler()
        window.addEventListener('resize', resizeHandler)

        return () => {
            window.removeEventListener('resize', resizeHandler)
        }

    }, [])

    const handleLeftArrowClick = () => {
        console.log('left')
        setOffset(
            (currentOffset) => {
                const newOffset = currentOffset + width
                const minOffset = 0
                
                return Math.min(minOffset, newOffset)
            }
        )
    }

    const handleRightArrowClick = () => {
        console.log('right')

        setOffset(
            (currentOffset) => {
                const newOffset = currentOffset - width
                const maxOffset = -(width * (pages.length - 1))
                
                return Math.max(maxOffset, newOffset)
            }
        )
    }

    useEffect(() => {
        setPages(
            Children.map(children, (child) => {
                return {
                    ...child,
                    props: {
                        ...child.props,
                        style: {
                            height: '100%',
                            minWidth: `${width}px`,
                            maxWidth: `${width}px`,
                            flexShrink: 0 // Важно: запрещаем сжатие элементов
                        }
                    }
                    
                }
            })
        )
    }, [children])

    return (

        <CarouselContext.Provider value={{ width: width }}>
        <div className="carousel"
            
        >

            
            <div className="window" ref={windowElementRef}>
                
                <div className="all-pages-container"
                style={{
                    transform: `translateX(${offset}px)`,
                    transition: 'transform 0.5s ease'
                }}>
                    {pages.length > 0 ? pages : children}
                </div>

            </div>
            <div className='arrows'>

                <button className='arrow' onClick={handleLeftArrowClick}>
                    <i class="bi bi-caret-left-fill"></i>
                </button>

                <button className='arrow' onClick={handleRightArrowClick}>
                    <i class="bi bi-caret-right-fill"></i>
                </button>

            </div>
            
        </div>
        </CarouselContext.Provider>
    )
}
Carousel.Page = Page









/*

import './Carousel.css'
import { useState, Children, useEffect } from 'react'

export default function Carousel({ children, itemWidth = 500 }) {
    const [offset, setOffset] = useState(0)
    const [totalItems, setTotalItems] = useState(0)

    const handleLeftArrowClick = () => {
        setOffset(current => Math.min(current + itemWidth, 0))
    }

    const handleRightArrowClick = () => {
        setOffset(current => {
            const maxOffset = -((totalItems - 1) * itemWidth)
            return Math.max(current - itemWidth, maxOffset)
        })
    }

    useEffect(() => {
        setTotalItems(Children.count(children))
    }, [children])

    return (
        <div className="carousel-container">
            <button className='arrow' onClick={handleLeftArrowClick}>
                <i className="bi bi-caret-left-fill"></i>
            </button>

            <div className="carousel-window">
                <div 
                    className="carousel-content"
                    style={{
                        transform: `translateX(${offset}px)`,
                        transition: 'transform 0.5s ease'
                    }}
                >
                    {Children.map(children, (child, index) => (
                        <div 
                            key={index}
                            className="carousel-item"
                            style={{
                                minWidth: `${itemWidth}px`,
                                maxWidth: `${itemWidth}px`
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            <button className='arrow' onClick={handleRightArrowClick}>
                <i className="bi bi-caret-right-fill"></i>
            </button>
        </div>
    )
}
    */
//Carousel.Page = CarPage