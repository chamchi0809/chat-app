import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import ErrorPage from "./pages/ErrorPage";
import {RecoilRoot} from "recoil";
import SignInPage from "./pages/signin/SignInPage";
import Layout from "./components/Layout";
import ChatRoomsPage from "./pages/chatrooms/ChatRoomsPage";
import ChatRoomPage from "./pages/chatrooms/ChatRoomPage";
import FriendsPage from "./pages/friends/FriendsPage";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage/>
    },
    {
        path: "/signin",
        element: <SignInPage />,
    },
    {
        path: "/chatrooms",
        element: <Layout><ChatRoomsPage/></Layout>,
    },
    {
        path: "/chatrooms/:roomId",
        element: <Layout><ChatRoomPage/></Layout>,
    },
    {
        path: "/friends",
        element: <Layout><FriendsPage/></Layout>,
    }
]);

const queryClient = new QueryClient();

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <RecoilRoot>
            <RouterProvider router={router}/>
        </RecoilRoot>
        <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
    </QueryClientProvider>

)
