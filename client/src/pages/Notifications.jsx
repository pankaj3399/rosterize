import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { notifications } from '../api/User';
import Loader from '../Components/Loader/Loader';

const NotificationItem = ({ date, message }) => (
    <div className="flex justify-between items-center p-2 border-b">
        <span>{`${new Date(date).getDate()}/${new Date(date).getMonth()}/${new Date(date).getFullYear()} : ${message}`}</span>
        {/* <span className="text-xl">&gt;</span> */}
    </div>
);

const Notifications = () => {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notifications'],
        queryFn: notifications,
    });

    if(isLoading) return <Loader />;

    return (
        <div className="p-4 w-full max-w-4xl mx-auto bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Notifications:</h2>
            <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Inbox:</h3>
                <div className="bg-gray-100 p-2 rounded">
                    {data && data.length>0 && data.map((notification) => (
                        <NotificationItem
                            key={notification._id}
                            date={notification.createdAt}
                            message={notification.message}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
