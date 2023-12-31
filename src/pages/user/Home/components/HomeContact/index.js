import React from 'react';
import './HomeContact.css';
import Homefeedback from '../HomeFeedback';

export default function HomeContact() {
    return (
        <div id="homeContact" className="px-6 pt-8 pb-9">
            <h2 className="title_h2">Share the love</h2>
            <h4 className="content_h4">See what our ShareTheMeal supporters have to say about us</h4>
            <div>
                <Homefeedback />
            </div>
        </div>
    );
}
