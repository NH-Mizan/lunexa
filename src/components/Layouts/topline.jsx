import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineLiveHelp } from "react-icons/md";
export default function Topline ()
{
    return(
         <div className="bg-[#000] py-2 hidden lg:block">
            <div className="container flex justify-between">
                <div className="top-left">
                    <p className="text-wt text-sm flex items-center"><IoLocationOutline className="text-wt" />Dinajpur City College, Balubari, Dinajpur</p>
                </div>
                <div className="top-right">
                    <p className="text-wt text-sm text-md flex items-center "> <MdOutlineLiveHelp /> Help Center</p>
                </div>
            </div>

         </div>
    )
}