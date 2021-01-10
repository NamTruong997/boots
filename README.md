# Introduce

This demo search function using HTML, CSS, Javascrips, Jquery, Matterialize.
Especially, Matterialize (https://materializecss.com/) like Boostrap - it 's CSS framework to help to build the website faster.
Using JS to handle some event user interacted with our website.

# How it work

User just typing some letter on the search box on top- right screen view. JS's event will listen this search box and find results from JSON file. Then go through stages of data filtering, string processing => render HTML to user.

# How to integrate it into another search box

NOTE: At each page, only support one search box.

# Step 1: Copy the general template as below and paste in the position you want to display

<li class="search-bar">
    <div class="search-wrapper input-field">
        <input class="search-elm" type="search" placeholder="Search products" />
        <label class="label-icon">
        <i class="material-icons" id="new-feature">search</i>
        </label>
        <i class="material-icons icon-close">close</i>
    </div>
</li>

# Step 2: Check some class name - it should be similar with data in Search.js file

Focus in some class name: "search-bar", "material-icons icon-close", "search-elm"..
Make sure all class name are correct

# Step 3: Change the config if you want

Read file Search.Js.
Find the some constant variables at the top of the file. You can customize all of them.

# For customize the layout of the Product section => Check the layout 's property in DEFINE_SEARCH variable

# For change the order of three blocks suggestions, collection and products => Change the position order of each property (suggestions, collection, products) in DEFINE_SEARCH variable. Appear first - Will Above
