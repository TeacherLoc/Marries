const form = document.getElementById('theme-form');
const statusText = document.getElementById('theme-status');

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = {
            backgroundStyle: form.backgroundStyle.value,
            chibi: {
                enabled: form.chibiEnabled.value === 'true',
                baseColor: form.baseColor.value,
                accentColor: form.accentColor.value,
                layer1Url: form.layer1Url.value.trim(),
                layer2Url: form.layer2Url.value.trim(),
                floatDuration: parseInt(form.floatDuration.value, 10) || 12
            },
            watercolor: {
                baseColor: form.watercolorBase.value,
                washUrl: form.watercolorWash.value.trim(),
                lineArtUrl: form.watercolorLine.value.trim()
            },
            fontBody: form.fontBody.value.trim(),
            fontScript: form.fontScript.value.trim()
        };

        statusText.textContent = 'Dang luu...';

        try {
            const response = await fetch('/api/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Khong the luu cau hinh');
            }

            statusText.textContent = 'Da luu thanh cong.';
        } catch (error) {
            console.error(error);
            statusText.textContent = 'Co loi khi luu, vui long thu lai.';
        }
    });
}
