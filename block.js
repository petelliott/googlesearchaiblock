const official_blocklist_url = "https://petelliott.github.io/googlesearchaiblock/blocklist.txt";

const query_xpath = (query, node) => {
    const xpathResult = document.evaluate(query, node, null, XPathResult.ANY_TYPE, null);

    const nodes = [];
    for (let node = xpathResult.iterateNext(); node; node = xpathResult.iterateNext()) {
        nodes.push(node);
    }

    return nodes;
}

var total_removed_count = 0;
const remove_ai_images = (node, blocklist) => {
    console.log("beginning AI image sweep");
    for (const site of blocklist) {
        const nodes = query_xpath(".//div[text()='"+site+"']", node);

        for (const node of nodes) {
            const imagediv = node.parentNode.parentNode.parentNode;
            imagediv.style.display = "none";
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

const observe_new_images = (mutations, blocklist) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            remove_ai_images(node, blocklist);
        }
    }
};

const get_blocklist = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return text
        .split("\n")
        .map(s => s.trim())
        .filter(s => !s.startsWith("#") && s !== "");
};

(async () => {
    const blocklist = await get_blocklist(official_blocklist_url);
    console.log("blocking AI images from "+blocklist.length+" sites");

    // remove preloaded images
    remove_ai_images(document, blocklist);

    // keep removing new imiages as they are loaded
    const image_list = query_xpath(".//div[@role='list']", document)[0];
    console.log(image_list);
    const observer = new MutationObserver(mutations => observe_new_images(mutations, blocklist));
    observer.observe(image_list, {childList: true});
})();
