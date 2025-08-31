import { useState } from "react";

function Chat_input({onSend}){
    const [message,setMessage]=useState("")
    function Hanlesubmit(e){
        
        e.preventDefault();
        if (message.trim()==="") return;
        onSend(message);
        setMessage("");

    };
    return(
        <div className="flex">
            <form onSubmit={Hanlesubmit}>
               <div className="flex flex-2">
                 <input type="text" 
                value={message} 
                onChange={(e)=>setMessage(e.target.value)}
                placeholder="Start the Chat" 
                className="bg-blue-100 text-gray-500 rounded-lg text-center text-sm w-full px-4 py-2"></input>
                <button 
                type = "submit"
                className="bg-blue-500 rounded-lg text-white ml-2 px-4 py-2 hover:bg-blue-600" >Submit</button>
               </div>
            </form>
        </div>
    )
}
export default Chat_input