import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddProject = () => {

  const {backendUrl,token}=useContext(AppContext)
  const navigate=useNavigate()

  const [projectName,setProjectName]=useState('')
  const [projectDate,setProjectDate]=useState('')
  const [location,setLocation]=useState('')

  
  const addProject=async()=>{
    try {
      const {data}=await axios.post(backendUrl+'/api/add-project',{projectName,projectDate,location},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.message)
      
    }
  }
  
  return (
    <div className='min-h-[70vh] flex items-center'>
     
      <div className='flex flex-col items-start gap-3 p-8 m-auto min-w-[340px] sm:min-w-96 border border-[#DADADA] rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
         <p className='text-2xl font-semibold m-auto'>Add Project </p>
         <div className='w-full'>
         <p>Project Name</p>
         <input className='border border-[#DADADA] w-full mt-1 p-2 rounded ' onChange={(e)=>setProjectName(e.target.value)} value={projectName} type="text" placeholder='Project Name'/>
         </div>
         <div className='w-full'>
         <p>Project Date</p>
         <input className='border border-[#DADADA] w-full mt-1 p-2 rounded ' onChange={(e)=>setProjectDate(e.target.value)} value={projectDate} type="date" placeholder='Project Date'/>
         </div>
         <div className='w-full'>
         <p>Project Location</p>
         <input className='border border-[#DADADA] w-full mt-1 p-2 rounded ' onChange={(e)=>setLocation(e.target.value)} value={location} type="text" placeholder='Project Location'/>
         </div>
         <button onClick={()=>addProject()} className='bg-gray-950 text-white w-full py-2 rounded-md text-base'>Add Project</button>

      </div>
    </div>
  )
}

export default AddProject
