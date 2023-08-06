import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Channel.css'



function Channels({accessToken, proxy}) {
	const [channels, setChannels] = useState([])

	const GetChannelsAxios = () => {
		axios.post(proxy + '/getChannels', {accessToken: accessToken})
		.then((response) => {
			setChannels(response.data);
		}).catch((err) => {
			console.log(err);
		});
	}

	useEffect(() => {
    GetChannelsAxios();
  }, [])

	const ChannelCard = (name, owner) => (
		<div className='channel-card-container'>
			<div>
				<div className='channel-card-name'>{name}</div>
				<div className='channel-card-owner'>{owner}</div>				
			</div>
			<div className='channel-card-messages'>
				50
			</div>
		</div>
	)

	return (
		<div>

				{channels.map((item, index) => (
					<div key={index}>{ChannelCard(item.name, item.owner)}</div>
				))}

		</div>
	)
}

export default Channels;