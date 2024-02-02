const banned_sites = [
    "Prompt Hunt",
    "OpenArt",
    "KREA",
    "ArtHub.ai",
    "Playground AI",
    "NightCafe Creator",
    "Craiyon",
    "Freepik",
    "ArtHub.ai"
];

const query_xpath = (query, node) => {
    const xpathResult = document.evaluate(query, node, null, XPathResult.ANY_TYPE, null);

    const nodes = [];
    for (let node = xpathResult.iterateNext(); node; node = xpathResult.iterateNext()) {
        nodes.push(node);
    }

    return nodes;
}

var total_removed_count = 0;

const remove_ai_images = (node) => {
    console.log("beginning AI image sweep");
    for (const site of banned_sites) {
        const nodes = query_xpath(".//div[text()='"+site+"']", node);

        for (const node of nodes) {
            node.parentNode.parentNode.parentNode.remove();
        }
        if (nodes.length > 0) {
            console.log("removed "+nodes.length+" AI images from "+site);
        }

        total_removed_count += nodes.length;
    }

    // this is where we would update the badge if we weren't lazy
    /*
    if (total_removed_count > 0) {
        console.log(chrome);
        browser.browserAction.setBadgeText({text: total_removed_count.toString()});
    }
    */
};

const observe_new_images = (mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            remove_ai_images(node);
        }
    }
};

// remove preloaded images
remove_ai_images(document);

// keep removing new imiages as they are loaded
const image_list = query_xpath(".//div[@role='list']", document)[0];
const observer = new MutationObserver(observe_new_images);
observer.observe(image_list, {childList: true});
