exports.handler = async (event) => {
    const { userId } = event.params.querystring;
    const displayUrl = process.env.URL + '/location/sf?userId=' + userId;

    const oTitle = 'Who would you like to message?';
    const oSubTitle = 'Click below to bring up our team';
    const oButton = 'See team';

    return {
        statusCode: 200,
        body: JSON.stringify(
            createButtons(displayUrl, oTitle, oSubTitle, oButton)
        )
    }
}

function createButtons(url, title, subtitle, buttonText) {
    return {
        messages:[
            {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        image_aspect_ratio: 'square',
                        elements: [
                            {
                                title,
                                subtitle,
                                buttons:[
                                    {
                                        url,
                                        title: buttonText,
                                        type: 'web_url',
                                        messenger_extensions: true,
                                        webview_height_ratio: 'tall'
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    }
}