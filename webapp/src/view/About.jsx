'use strict';

var React = require('react');

var AboutPage = React.createClass({
    render: function() {
        return (
            <div className='about'>
                <div className='content'>
                    <h1>About</h1>
                    <p>Rhizomes are underground systems that produce stems and roots of plants, allowing them to grow and thrive. They store nutrients that help plants survive and regenerate in the most challenging conditions. Ceaselessly establishing new connections between them, rhizomes constitute resilient, flexible and dynamic systems, rooted in their local environments and primed for long-term sustainability.</p>
                    <p>Rhizome DB supports the polio programme’s critical need to adapt, evolve and reach the unreached. Rhizome DB connects staff, managers and policy makers to the evidence they need to drive local solutions. Maximize your impact to eradicate polio.</p>
                </div>
            </div>
        )
    }
});

module.exports = AboutPage;