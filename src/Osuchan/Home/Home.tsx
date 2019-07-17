import React, { FunctionComponent } from "react";
import { Typography, Link } from "@material-ui/core";

const Homepage: FunctionComponent = () => (
    <>
        <Typography variant="h2" paragraph>Welcome to the osu!chan Beta!</Typography>

        <Typography variant="body1" paragraph>
            You can view a player's profile by searching their username in the top right.
            <br />
            You can explore the custom leaderboard system via the link in the sidebar.
        </Typography>

        <Typography variant="body1" paragraph>
            Please remember this is a beta, so expect to encounter bugs and inconsistencies.
            <br />
            If you run into any bugs, please let me know in the <a href="https://discord.gg/z7c9tD6">discord server</a>.
        </Typography>

        <br />

        <Typography variant="h3" paragraph>FAQ</Typography>
        
        <Typography variant="h6">
            <em>Where are all the features that classic osu!chan has?</em>
        </Typography>
        <Typography variant="body2">
            The focus of this beta is primarily to test the custom leaderboard system, so many of the features I plan to implement have yet to come.
            <br />
            Some of classic osu!chan's features will be coming to this version in new and improved forms, and some will not.
            <br />
            For example, at the moment, I don't have any plans on implementing the Mod PP statistics from classic osu!chan as they are somewhat replaced by the global leaderboards.
            <br />
            But other features like no-choke statistics will be coming in the future in a much improved form.
        </Typography>
        
        <br />
        
        <Typography variant="h6">
            <em>Why didn't my score submit?</em>
        </Typography>
        <Typography variant="body2">
            Score submissions work by checking your top 100 pp scores, as well as you last 50 plays (including fails/retries) for osu!standard.
            <br />
            Because of this, if you wait too long after making a score before checking osu!chan, the play will not be retrieved.
            <br />
            Additionally, profile updates have a cooldown of 5 minutes, so sometimes you might have to wait a couple minutes to see new scores.
            <br />
            If there is a score that is not retrieved by normal means, you can use the Add Scores button in the top right menu to manually add scores for specific beatmaps.
        </Typography>
        
        <br />
        
        <Typography variant="h6">
            <em>Why doesn't osu!chan check the last 50 plays for non-standard gamemodes?</em>
        </Typography>
        <Typography variant="body2">
            The osu!api endpoint used for this doesn't return pp values for scores.
            <br />
            This means that any scores retrieved with this method need to have their pp calculated by osu!chan, which can only be done for osu!standard at this point.
        </Typography>
        
        <br />
        
        <Typography variant="h6">
            <em>Why is the pp for some of my scores different to the osu! website?</em>
        </Typography>
        <Typography variant="body2">
            As mentioned in the previous answer, some scores need to have their pp calculted by osu!chan rather than getting the data from osu!.
            <br />
            osu!chan uses <Link color="secondary" href="https://github.com/Francesco149/oppai-ng">oppai</Link> to calculate pp for these scores, which can sometimes have slight differences to official pp values.
        </Typography>
        
        <br />
        
        <Typography variant="h6">
            <em>I created a leaderboard, but it isn't showing up in the leaderboard list. Why?</em>
        </Typography>
        <Typography variant="body2">
            The Community Leaderboard list at the moment only displays the top 25 leaderboards (by number of members) that are visible to you (public leaderboards and private leaderboards you are a member of).
            <br />
            You can view all the leaderboards a user has joined (except private ones you aren't a member of) in their profile.
            <br />
            You will be able to see any leaderboards you create in your profile too.
        </Typography>
    </>
);

export default Homepage;
