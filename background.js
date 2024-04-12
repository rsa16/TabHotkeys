browser.commands.onCommand.addListener(command => handleHotKeys(command));

let closeCommandGroup = [
    'close-other-tabs', 
    'close-left-tabs', 
    'close-right-tabs'
]

let moveCommandGroup = [
    'move-to-start',
    'move-to-end'
]

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

    if (closeCommandGroup.includes(commandId)) { 
        await closeTabs(commandId.split("-")[1]); 
    } else if (moveCommandGroup.includes(commandId)) { 
        await moveTabs(commandId.split("-")[2]); 
    } else {
        var tabs = await browser.tabs.query({currentWindow: true});
        await browser.tabs.highlight({tabs: tabs.map(tab => tab.index)});
    }
}
