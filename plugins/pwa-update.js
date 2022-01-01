export default async function () {
    const workbox = await window.$workbox

    if (!workbox) {
        console.debug("Workbox couldn't be loaded.")
        return
    }

    workbox.addEventListener('installed', (event) => {
        if (event.isUpdate === true) {
            console.debug('There is an update for the PWA, reloading...')

            // window.location.reload()

            return
        }

        console.debug('The PWA is on the latest version.')
    })
}
