import React from "react";

function Home() {
    return (
        <>
            <h1>Welcome to the osu!chan!</h1>

            <p>
                You can view a player's profile by searching their username in the top right.
                <br />
                You can explore the custom leaderboard system via the link in the sidebar.
            </p>

            <p>
                If you run into any bugs, please report them preferrably as a github issue on <a href="https//github.com/Syriiin/osuchan-backend">the repository</a> or alternativly in the <a href="https://discord.gg/z7c9tD6">discord server</a>.
            </p>

            <br />

            <h2>FAQ</h2>
            
            <h3>
                <em>Where are all the features that classic osu!chan has?</em>
            </h3>
            <p>
                Some of classic osu!chan's features will be coming to this version in new and improved forms, and some will not.
                <br />
                For example, at the moment, I don't have any plans on implementing the Mod PP statistics from classic osu!chan as they are somewhat replaced by the global leaderboards.
                <br />
                But other features like no-choke statistics will be coming in the future in a much improved form.
            </p>
            
            <h3>
                <em>Why didn't my score submit?</em>
            </h3>
            <p>
                Score submissions work by checking your top 100 pp scores, as well as you last 50 plays (including fails/retries) for osu!standard.
                <br />
                Because of this, if you wait too long after making a score before checking osu!chan, the play will not be retrieved.
                <br />
                Additionally, profile updates have a cooldown of 5 minutes, so sometimes you might have to wait a couple minutes to see new scores.
                <br />
                If there is a score that is not retrieved by normal means, you can use the Add Scores button in the top right menu to manually add scores for specific beatmaps.
            </p>
            
            <h3>
                <em>Why doesn't osu!chan check the last 50 plays for non-standard gamemodes?</em>
            </h3>
            <p>
                The osu!api endpoint used for this doesn't return pp values for scores.
                <br />
                This means that any scores retrieved with this method need to have their pp calculated by osu!chan, which can only be done for osu!standard at this point.
            </p>
            
            <h3>
                <em>Why is the pp for some of my scores different to the osu! website?</em>
            </h3>
            <p>
                As mentioned in the previous answer, some scores need to have their pp calculted by osu!chan rather than getting the data from osu!.
                <br />
                osu!chan uses <a href="https://github.com/Francesco149/oppai-ng">oppai</a> to calculate pp for these scores, which can sometimes have slight differences to official pp values.
            </p>
            
            <h3>
                <em>I created a leaderboard, but it isn't showing up in the leaderboard list. Why?</em>
            </h3>
            <p>
                The Community Leaderboard list at the moment only displays the top 25 public leaderboards (by number of members).
                <br />
                You can view all the leaderboards a user has joined (except private ones you aren't a member of) in their profile.
                <br />
                You will be able to see any leaderboards you create in your profile too.
                <br />
                To view any private leaderboards you are a member of, you need to check the list in your profile.
            </p>
        </>
    );
}

export default Home;
