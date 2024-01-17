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

for (const site of banned_sites) {
    const xpathResult = document.evaluate("//div[text()='"+site+"']", document, null, XPathResult.ANY_TYPE, null );

    const nodes = [];
    for (let node = xpathResult.iterateNext(); node; node = xpathResult.iterateNext()) {
        nodes.push(node);
    }

    for (const node of nodes) {
        node.parentNode.parentNode.parentNode.remove();
    }
    console.log("removed "+nodes.length+" AI images from "+site);
}
