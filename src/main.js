document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // フォームのデフォルト送信を防ぐ

    // フォームデータを取得
    const bookName = document.getElementById('book-name').value;
    const bookType = document.getElementById('book-type').value;
    const howMuch = document.getElementById('how-much').value;
    const howLong = document.getElementById('how-long').value;
    const apiKey = document.getElementById('api-key').value;
    const ddSite = document.getElementById('dd-site').value;

    const bookNameForTags = "book_name:" +bookName;
    const bookTypeForTags = "book_type:" +bookType;
    
    // 送信するデータを構築
    const requestData = {
        series: [
            {
                metric: "book.read.time_spend",
                type: 1,
                points: [
                    {
                        timestamp: Math.floor(Date.now() / 1000),
                        value: howLong
                    }
                ],
                tags: [
                    bookNameForTags,
                    bookTypeForTags

                ]
            },
            {
                metric: "book.read.pages",
                type: 1,
                points: [
                    {
                        timestamp: Math.floor(Date.now() / 1000),
                        value: howMuch
                    }
                ],
                tags: [
                    bookNameForTags,
                    bookTypeForTags

                ]
            }
        ]
    };
    console.log(requestData);

    try {
        console.log()
        // HTTPリクエストを送信
        const datadogSite = ddSite || 'https://api.datadoghq.com'; // デフォルトを指定
        const response = await fetch('https://api.datadoghq.com/api/v2/series', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DD-API-KEY': apiKey,
            },
            body: JSON.stringify(requestData)
        });
        console.log(response);

        // レスポンスを確認
        if (response.ok) {
            const responseData = await response.json();
            alert('Metrics submitted successfully: ' + JSON.stringify(responseData));
        } else {
            const errorData = await response.json();
            alert('Failed to submit metrics: ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Error submitting metrics:', error);
        alert('An error occurred while submitting metrics.');
    }
});