import React, {useContext, useState} from 'react';
import Createpost from "../components/Auth/Feed/CreatePost";
import Posts from "../components/Auth/Feed/Posts";
//import "./../styles/createpost.css"
//import "./../styles/posts.css"

import {UidContext} from "../components/Log/AppContext";
import {useNavigate} from "react-router-dom";

const Feed = () => {
    const [users] = useState([]);
    const uid = useContext(UidContext);
    const navigate = useNavigate();


    return (
        <>
            <head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <title> Feed </title>
            </head>
            <div id="body-el">
                <div className="content">
                    <div className="center">
                        <div className="form">
                            <Createpost />
                            <Posts />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Feed;
