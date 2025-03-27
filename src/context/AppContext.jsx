import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {


    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [projectData, setProjectData] = useState([])

    const [expenseData, setExpenseData] = useState([]);
    


    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('/')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }




    const getProjectData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/projects', { headers: { token } })
            if (data.success) {
                setProjectData(data.projectdata)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

  








    const value = {
        token,
        setToken,
        backendUrl,
        projectData, setProjectData, getProjectData,
        slotDateFormat,
        expenseData,
        setExpenseData,

    }


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )


}

export default AppContextProvider;
