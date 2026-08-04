import * as d3 from 'd3';
import scrollama from 'scrollama';
import '../main.css';

// ─── STEPS ────────────────────────────────────────────────────────────────────
// Each step has a `text` shown in the scroll panel and a `data` array of
// { label, value } objects that drive the bar chart.
// Edit these to use your own data — add/remove steps or change the numbers.
// ──────────────────────────────────────────────────────────────────────────────
const steps = [
  {
    data: [
      { label: 'AA/A',  value: 3812 },
      { label: 'B', value:  5605 },
      { label: 'C',  value: 7177 },
      { label: 'D', value:  9068 },
      { label: 'E',  value: 9151 },
      { label: 'F', value:  10267 },
      { label: 'G',  value: 12237 },
      { label: 'H', value:  13094 },
      { label: 'I',  value: 16035 },
      { label: 'J', value:  16534 },
      { label: 'K',  value: 20409 },
      { label: 'L', value:  27815 },
    ],
  },
  {
    data: [
      { label: 'AA-K',  value: 787 },
      { label: 'L', value:  883 },
    ],
  },
  {
    data: [
      { label: 'AA/A',  value: 3812 },
      { label: 'B', value:  7928 },
      { label: 'C',  value: 11919 },
      { label: 'D', value:  11619 },
      { label: 'E',  value: 11369 },
      { label: 'F', value:  11772 },
      { label: 'G',  value: 11992 },
      { label: 'H', value:  11280 },
      { label: 'I',  value: 11615 },
      { label: 'J', value:  11592 },
      { label: 'K',  value: 11657 },
      { label: 'L', value:  11567 },
      { label: 'M',  value: 11507 },
      { label: 'N', value:  11596 },
    ],
  },
];
// ──────────────────────────────────────────────────────────────────────────────

// ─── CHART SETUP ──────────────────────────────────────────────────────────────
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width  = 400 - margin.left - margin.right;
const height = 360 - margin.top  - margin.bottom;

const svg = d3.select('#d3-scrolly')
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand().range([0, width]).padding(0.3);

const y = d3.scaleLinear().range([height, 0]);
const color = d3.scaleOrdinal(d3.schemeTableau10);

const xAxis = svg.append('g').attr('transform', `translate(0,${height})`);
const yAxis = svg.append('g');

function update(stepIndex) {
  const { data } = steps[stepIndex];

  x.domain(data.map((d) => d.label));
  y.domain([0, d3.max(data, (d) => d.value) * 1.15]);

  xAxis.transition().duration(500).call(d3.axisBottom(x));
  yAxis.transition().duration(500).call(d3.axisLeft(y).ticks(5));

  svg.selectAll('rect.bar')
    .data(data, (d) => d.label)
    .join(
      (enter) =>
        enter
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => x(d.label))
          .attr('width', x.bandwidth())
          .attr('y', height)
          .attr('height', 0)
          .attr('fill', (d) => color(d.label))
          .attr('rx', 3),
      (update) => update,
      (exit) => exit.transition().duration(400).attr('y', height).attr('height', 0).remove()
    )
    .transition()
    .duration(600)
    .attr('x', (d) => x(d.label))
    .attr('width', x.bandwidth())
    .attr('y', (d) => y(d.value))
    .attr('height', (d) => height - y(d.value))
    .attr('fill', (d) => color(d.label));
}

// ─── SCROLLAMA ────────────────────────────────────────────────────────────────
update(0);

const scroller = scrollama();

scroller
  .setup({
    step: '.step',
    offset: 0.6,  // trigger when step is 60% down the viewport
  })
  .onStepEnter(({ element, index }) => {
    document.querySelectorAll('.step').forEach((s) => s.classList.remove('is-active'));
    element.classList.add('is-active');
    update(index);
  });

window.addEventListener('resize', scroller.resize);
