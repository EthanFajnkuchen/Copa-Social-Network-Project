import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TableStandingData from "../components/Home/TableStandingData";
import Navbar from "../components/Home/Navbar";
const LeagueFeed = () => {
    const [selectedLeagueId, setSelectedLeagueId] = useState(null);

    const leagues = [
        { name: 'England Premier League', id: 152, flag:  "https://flagsapi.com/GB/flat/64.png" },
        { name: 'Serie A', id: 207, flag:  "https://flagsapi.com/IT/flat/64.png" },
        { name: 'La Liga', id: 302, flag:  "https://flagsapi.com/ES/flat/64.png" },
        { name: 'Israeli Premier League', id: 202, flag: "https://flagsapi.com/IL/flat/64.png"},
        { name: 'French League', id: 168, flag:  "https://flagsapi.com/FR/flat/64.png" },
        { name: 'Bundesliga', id: 175, flag:  "https://flagsapi.com/DE/flat/64.png" },
    ];

    const handleClick = (leagueId) => {
        setSelectedLeagueId(leagueId);
    };
    return (
        <div className="main-container">
            <Navbar />
            <Container>
                <Paper elevation={3} style={{ padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <Typography variant="body1">
                        Choose one of the countries that you want to display their league state
                    </Typography>
                    <Box display="flex" flexDirection="row" flexWrap="wrap">
                        {leagues.map((league) => (
                            <Avatar
                                key={league.id}
                                alt={league.name}
                                src={league.flag}
                                onClick={() => handleClick(league.id)}
                                sx={{ margin: 1, cursor: 'pointer' }}
                            />
                        ))}
                    </Box>
                </Paper>
                {selectedLeagueId && <TableStandingData leagueId={selectedLeagueId} />}
            </Container>
        </div>
    );
};

export default LeagueFeed;