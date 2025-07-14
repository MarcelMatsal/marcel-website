'use client';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

export default function TimelineSection() {
  return (
    <section id="experience" className="py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
      <VerticalTimeline animate={true} lineColor="rgb(164, 208, 244)">
        {/* Timeline Element 1 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#FF9999', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #FF9999' }}
          date="Summer 2025"
          dateClassName="text-black dark:text-white font-bold"
          iconStyle={{ background: '#FF9999', color: '#fff' }}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="24" height="24"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"/></svg>}
        >
          <h3 className="vertical-timeline-element-title">Software Engineer Intern</h3>
          <h4 className="vertical-timeline-element-subtitle">Pinterest</h4>
          <p className="text-white font-bold">Backend - Observability Team</p>
          <p className="text-white font-bold">Developing GenAI tools (such as agents, MCP servers, anomaly detection) for all engineers at Pinterest.</p>
        </VerticalTimelineElement>
        

        {/* Timeline Element 2 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#99C1FF', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #99C1FF' }}
          date="Dec 2024 - May 2025"
          dateClassName="text-gray-900 dark:text-white font-bold"
          iconStyle={{ background: '#99C1FF', color: '#fff' }}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="24" height="24">
            <path d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H336.8c-11.8-25.5-29.9-47.5-52.4-64H384V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V64L224 64v49.1C205.2 102.2 183.3 96 160 96V64zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352h53.3C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7H26.7C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
          </svg>}
        >
          <h3 className="vertical-timeline-element-title">Teaching Assistant</h3>
          <h4 className="vertical-timeline-element-subtitle">CSCI 1470: Deep Learning</h4>
          <p className="text-white font-bold">Brown University</p>
        </VerticalTimelineElement>

        {/* Timeline Element 3 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#D8BFD8', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #D8BFD8' }}
          date="Oct 2024 - Present"
          dateClassName="text-black dark:text-white font-bold"
          iconStyle={{ background: '#D8BFD8', color: '#fff' }}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>}
        >
          <h3 className="vertical-timeline-element-title"> Researcher</h3>
          <h4 className="vertical-timeline-element-subtitle">Balestriero Lab @ Brown University</h4>
          <p className="text-white font-bold">Researching spurious correlation in language models. <a href="https://arxiv.org/abs/2506.11402" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold hover:underline">Check out our new paper!</a></p>
        </VerticalTimelineElement>

                {/* Timeline Element 3 */}
                <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{ background: '#9fd893', color: '#ffffff' }} // Lighter green background and white text
                contentArrowStyle={{ borderRight: '7px solid #9fd893' }} // Arrow matches the background
                date="Jun 2024 - Aug 2024"
                dateClassName="text-black dark:text-white font-bold"
                iconStyle={{ background: '#9fd893', color: '#ffffff' }} // Icon background matches and text remains white
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
                    <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 128c-70.58 0-128 57.42-128 128s57.42 128 128 128c70.58 0 128-57.42 128-128S326.6 128 256 128zM256 336c-44.11 0-80-35.89-80-80c0-44.11 35.89-80 80-80c44.11 0 80 35.89 80 80C336 300.1 300.1 336,256,336z"/>
                  </svg>
              }
              >
              <h3 className="vertical-timeline-element-title text-white">Software Engineer Intern</h3>
              <h4 className="vertical-timeline-element-subtitle text-white">Dexcom</h4>
              <p className="text-white font-bold">
                  Developed architecture for a new mobile app and designed a novel algorithm to target
                  700k new stakeholders
              </p>
              </VerticalTimelineElement>

        {/* Timeline Element 4 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#99C1FF', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #99C1FF' }}
          date="Sep 2023 - Dec 2023"
          dateClassName="text-black dark:text-white font-bold"
          iconStyle={{ background: '#99C1FF', color: '#fff' }}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor" width="24" height="24">
            <path d="M160 64c0-35.3 28.7-64 64-64H576c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H336.8c-11.8-25.5-29.9-47.5-52.4-64H384V320c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v32h64V64L224 64v49.1C205.2 102.2 183.3 96 160 96V64zm0 64a96 96 0 1 1 0 192 96 96 0 1 1 0-192zM133.3 352h53.3C260.3 352 320 411.7 320 485.3c0 14.7-11.9 26.7-26.7 26.7H26.7C11.9 512 0 500.1 0 485.3C0 411.7 59.7 352 133.3 352z"/>
          </svg>}
        >
          <h3 className="vertical-timeline-element-title">Teaching Assistant</h3>
          <h4 className="vertical-timeline-element-subtitle">Econ 1000: Using Big Data to Solve Social and Economic Problems</h4>
          <p className="text-white font-bold">Brown University</p>
        </VerticalTimelineElement>


        {/* Timeline Element 4 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#D8BFD8', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #D8BFD8' }}
          date="May 2023 - Sep 2023"
          dateClassName="text-black dark:text-white font-bold"
          iconStyle={{ background: '#D8BFD8', color: '#fff' }}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>}
        >
          <h3 className="vertical-timeline-element-title">Researcher</h3>
          <h4 className="vertical-timeline-element-subtitle">SAVE Lab @ UTSA</h4>
          <p className="text-white font-bold">Updated tensorflow models / data pipelines</p>
        </VerticalTimelineElement>



        {/* Timeline Element Education */}
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: '#B19386', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid #B19386' }}
          date="Sep 2022 - Present"
          dateClassName="text-black dark:text-white font-bold"
          iconStyle={{ background: '#B19386', color: '#fff' }}
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="24" height="24">
            <path d="M243.4 2.6l-224 96c-14 6-21.8 21-18.7 35.8S16.8 160 32 160v8c0 13.3 10.7 24 24 24H456c13.3 0 24-10.7 24-24v-8c15.2 0 28.3-10.7 31.3-25.6s-4.8-29.9-18.7-35.8l-224-96c-8.1-3.4-17.2-3.4-25.2 0zM128 224H64V420.3c-.6 .3-1.2 .7-1.8 1.1l-48 32c-11.7 7.8-17 22.4-12.9 35.9S17.9 512 32 512H480c14.1 0 26.5-9.2 30.6-22.7s-1.1-28.1-12.9-35.9l-48-32c-.6-.4-1.2-.7-1.8-1.1V224H384V416H344V224H280V416H232V224H168V416H128V224zm128-96c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z"/>
          </svg>}
        >
          <h3 className="vertical-timeline-element-title">Junior studying Computer Science and Economics</h3>
          <h4 className="vertical-timeline-element-subtitle">Brown University</h4>
          <p className="text-white font-bold">GPA: 4.0</p>
        </VerticalTimelineElement>

        {/* Add more elements as needed */}
      </VerticalTimeline>
    </section>
  );
}
