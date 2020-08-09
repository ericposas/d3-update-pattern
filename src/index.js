import * as d3 from 'd3'
import random from 'random'
import './style.scss'


window.start = () => {

	const makeData = (n, min, max) => (
		new Array(n)
		.fill(1)
		.map(a => [random.int(min, max), random.int(min, max)])
		.sort((a, b) => a[0] - b[0])
	)

	let width = 700, height = 500, margin = 40, max = 1000

	let data1 = makeData(20, 1, max)
	let data2 = makeData(10, 1, max)
	let data3 = makeData(50, 1, max)

	let svg = d3.select('svg')
	.attr('width', width)
	.attr('height', height)
	.style('border', '1px solid lightgrey')

	let combinedData = data1.concat(data2).concat(data3)

	let scX = d3.scaleLinear()
	.domain(d3.extent(combinedData, d => d[0]))
	.range([margin, width - margin])

	let scY = d3.scaleLinear()
	.domain(d3.extent(combinedData, d => d[1]))
	.range([height - margin, margin])

	let axX = d3.axisTop().scale(scX)
	svg.append('g')
	.attr('transform', `translate(0, ${height})`)
	.call(axX)

	let axY = d3.axisRight().scale(scY)
	svg.append('g')
	.call(axY)

	const loadDataset1 = () => {

		if (document.getElementById('circles')) {
			let exit = svg.select('#circles')
			.selectAll('circle')
			.data(data1).exit()

			exit.transition().duration(500).delay((d,i) => 1*10)
			.on('end', () => {
				let enter = svg.select('#circles')
				.selectAll('circle').data(data1)

				enter.merge(enter)
				.transition().duration(500).delay((d,i) => i*10)
				.on('end', () => { btn2.style.display = 'block' })
				.attr('cx', d => scX(d[0]))
				.attr('cy', d => height - scY(d[1]))
				.attr('fill', 'red')
			})
			.attr('r', 0)
		} else {
			svg.append('g').attr('id', 'circles')
			.selectAll('circle')
			.data(data1).enter().append('circle')
			.attr('cx', d => scX(d[0] - 100))
			.attr('cy', d => height - scY(d[1] - 100))
			.attr('fill', 'red')
			// .on('mouseover', d => alert(`${d[0]}, ${max - d[1]}`))
			.attr('r', 0)
			.transition().duration(500).delay((d,i) => i*10)
			.on('end', () => { btn2.style.display = 'block' })
			.attr('cx', d => scX(d[0]))
			.attr('cy', d => height - scY(d[1]))
			.attr('r', 4)
			console.log(svg.select('#circles')._groups[0])
		}

		btn1.style.display = 'none'
	}

	const loadDataset2 = () => {
		btn2.style.display = 'none'

		let exitSel = svg.select('#circles').selectAll('circle')
		.data(data2).exit() // bind the data and select dom elements that do not have a matching datum

		let enterSel = svg.select('#circles')
		.selectAll('circle').data(data2) // prepare an enter selection

		exitSel // transition out the elements that need to be removed
		.transition().duration(500).delay((d,i) => i*10)
		.on('end', mergeSelection)
		.attr('r', 0)

		function mergeSelection() {
			// upon removal of extra elements (elms that do not exist in the dataset),
			// ..using our enter selection, merge the existing elements to the dataset
			exitSel.remove()
			enterSel.merge(enterSel)
			.transition().duration(500).delay((d,i) => i*10)
			.on('end', () => {
				btn3.style.display = 'block'
			})
			.attr('cx', d => scX(d[0]))
			.attr('cy', d => height - scY(d[1]))
			.attr('fill', 'blue')
		}

	}

	const loadDataset3 = () => {
		let enter = svg.select('#circles')
		.selectAll('circle')
		.attr('fill', 'green')
		.data(data3) // bind the new data

		enter.merge(enter) // merge existing elements to new data
		.transition().duration(500).delay((d,i) => i*10)
		.attr('cx', d => scX(d[0]))
		.attr('cy', d => height - scY(d[1]))

		enter.enter().append('circle') // create new elements for the rest of the dataset using enter() selection
		.attr('cx', d => scX(d[0] - 100))
		.attr('cy', d => height - scY(d[1] - 100))
		.attr('fill', 'green')
		.attr('r', 0)
		.transition().duration(500).delay((d,i) => i*10)
		.on('end', () => {
			btn3.style.display = 'none'
			btn1.style.display = 'block'
		})
		.attr('cx', d => scX(d[0]))
		.attr('cy', d => height - scY(d[1]))
		.attr('r', 4)
	}

	// svg.select('#circles')
	// .attr('transform', `translate(${margin}, ${margin})`)

	let btn1 = document.createElement('button')
	btn1.innerHTML = 'dataset 1'
	document.body.append(btn1)
	btn1.onclick = loadDataset1

	let btn2 = document.createElement('button')
	btn2.innerHTML = 'dataset 2'
	document.body.append(btn2)
	btn2.onclick = loadDataset2
	btn2.style.display = 'none'

	let btn3 = document.createElement('button')
	btn3.innerHTML = 'dataset 3'
	document.body.append(btn3)
	btn3.onclick = loadDataset3
	btn3.style.display = 'none'

}
