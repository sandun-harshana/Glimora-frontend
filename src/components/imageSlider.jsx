import { useState } from "react"

export default function ImageSlider(props){
    const images = props.images
    const [activeImage, setActiveImage]= useState(0)

    return(
        <div className="w-full max-w-[400px] mx-auto">
            <img className="w-full h-[300px] sm:h-[400px] object-cover rounded-2xl shadow-lg" src={images[activeImage]}/>
            <div className="w-full h-auto py-4 flex justify-center items-center gap-2 overflow-x-auto">
                {
                    images.map(
                        (img, index)=>{
                            return(
                                <img onClick={()=>{
                                    setActiveImage(index)
                                }} key={index} className={"w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] object-cover rounded-xl cursor-pointer transition-all duration-300 "+(activeImage == index ? "border-[3px] border-accent shadow-lg scale-105" : "border-2 border-gray-200 opacity-70 hover:opacity-100")} src={img}/>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}