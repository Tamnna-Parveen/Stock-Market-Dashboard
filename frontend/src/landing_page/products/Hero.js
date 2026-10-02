import React from 'react';

function Hero(){
    return (
        <div className='container'>
            <div className='text-center mt-5 p-3'>
                <h1>Technology</h1>
                <h3 className='text-muted mt-3 fs-4'>
                    Sleek, modern and intutive trading platforms
                </h3>
                <p className='mt-3'> 
                    Check out our{" "}
                    <a href="" style={{textDecoration:"none"}}>
                        investemnt offerings{" "}
                        <i class="fa fa-long-arrow-right" arial-hidden="true"></i>
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Hero;