browser.commands.onCommand.addListener(command => handleHotKeys(command));

async function closeTabs(commandIndex) {
    var tabs = await browser.tabs.query({currentWindow: true});
    var activeTabs = await tabs.filter(tab => tab.highlighted);

    var removeIds = []

    switch (commandIndex) {
        case 'other':
            removeIds = tabs.filter(tab => !tab.highlighted && !tab.pinned).map(tab => tab.id);
            break;
        case 'left':
            removeIds = tabs.filter(tab => !tab.pinned && (tab.index < activeTabs.at(0).index)).map(tab => tab.id);
            break;
        case 'right':
            removeIds = tabs.filter(tab => !tab.pinned && (tab.index > activeTabs.at(-1).index)).map(tab => tab.id);
            break;
    }

    browser.tabs.remove(removeIds);
}

async function moveTabs(commandIndex) {
    var tabs = await browser.tabs.query({ highlighted: true, currentWindow: true });
    var tabIDs = tabs.map(tab => tab.id);

    switch (commandIndex) {
        case 'start':
            await browser.tabs.move(tabIDs, { index: 0 });
            break;
        case 'end':
            await browser.tabs.move(tabIDs, { index: -1 });
            break;
    }
}

async function handleHotKeys(commandId) {
    // console.log(commandId);

    switch (commandId) {
        case "close-other-tabs":
        case "close-left-tabs":
        case "close-right-tabs":
            await closeTabs(commandId.split("-")[1]);
            break;

        case "move-to-start":
        case "move-to-end":
            await moveTabs(commandId.split("-")[2]);
            break;

        case "select-all-tabs":
            var tabs = await browser.tabs.query({currentWindow: true});
            await browser.tabs.highlight({tabs: tabs.map(tab => tab.index)});
            break;
    }
}
