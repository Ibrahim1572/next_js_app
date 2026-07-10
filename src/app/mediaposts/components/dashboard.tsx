'use client'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast'

export default function Dashboard(){

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [chartGraphData, setChartGraphData] = useState<any[]>([])


    const getGraphData=async()=>{
        // const data=await axios.get('/api/users/dashboard')|| []
        // console.log(`data: ${data}`)
        // return data.data

        const response = await axios.get('/api/users/dashboard')
        if (response.data && response.data['data']) {
            setChartGraphData(response.data['data']);
        if(response.data.status===200){
            toast.success(response.data.toastMessage)
        }
        else{
            toast.error(response.data.toastMessage)
        }
    }}

    useEffect(function() {
        getGraphData();
    }, []);

    return (
                        <div className="w-full">
                            {getGraphData()}
                            <h1 className="text-xl font-bold mb-4 text-center">Simple Area Chart</h1>
                            <div className="w-full h-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartGraphData}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorUpdated" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#df4141" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#df4141" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorDeleted" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#eaec49" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#eaec49" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                        <XAxis dataKey="name" stroke="#cbd5e1" />
                                        <YAxis stroke="#cbd5e1" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                                            labelStyle={{ color: '#f1f5f9' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="created"
                                            stroke="#34d399"
                                            fillOpacity={1}
                                            fill="url(#colorCreated)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="updated"
                                            stroke="#df4141"
                                            fillOpacity={1}
                                            fill="url(#colorUpdated)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="deleted"
                                            stroke="#eaec49"
                                            fillOpacity={1}
                                            fill="url(#colorDeleted)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    );
}