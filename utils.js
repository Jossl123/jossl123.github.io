function toDisplayableRetex(name, title, description, tags, date="12 mai"){
    return `
    <div class="rounded-lg bg-[--dark-gray] flex flex-col scale-100 hover:scale-105 transition-all shadow-xl">
        <div class="absolute p-1 flex gap-2 flex-wrap">${tags}</div>
        <img class="rounded-t-lg max-h-64 object-cover" src="./img/pp/${name}.png" alt="">
        <div class="p-6 flex flex-col flex-1">
            <p class="text-white font-bold text-2xl">${title}</p>
            <p class="text-white line-clamp-2">${description}</p>
            <p class="mt-auto mb-0 text-[--gray] font-bold">${date}</p>
        </div>
    </div>`
}