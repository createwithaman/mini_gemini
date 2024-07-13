import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext()

const ContextProvider = (props)=>{

    const [input,setInput] = useState("")
    const [recentPrompt,setRecentPrompt] = useState("")
    const [prevPrompt,setPrevPrompt] = useState([])
    const [showResult,setShowResult] = useState(false)
    const [loading,setLoading] = useState(false)
    const [resultData,setResultData] = useState("")

    const delayPera =(index,nextWord)=>{
        setTimeout(function (){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }


    const onSent = async (prompt)=>{

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else{
            setPrevPrompt(prev=>[...prev,input])
            setRecentPrompt(input)
            response = await run(input)
        }
        let responseArr = response.split("**")
        let newRes="";
        for(let i=0;i< responseArr.length ;i++){
            if(i===0 || i%2 !== 1){
                newRes += responseArr[i]
            } else {
                newRes += "<b>"+responseArr[i]+"</b>"
            }
        }

        let newRes2 = newRes.split("*").join("</br>")
        let newResponseArr = newRes2.split(" ")
        for(let i=0;i<newResponseArr.length;i++){
            const nextWord = newResponseArr[i];
            delayPera(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }
    

    const ContextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider