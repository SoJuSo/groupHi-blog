interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: '그루파이',
    description: `그루파이 서비스는 아이스브레이킹 게임을 찾는 데 소요되는 시간을 대폭 줄이고, 첫 만남이 어색한 팀 구성원 간의 친밀감을 높여주는 가치를 제공하는 서비스 입니다.그루파이 서비스는 다양한 아이스브레이킹 게임을 제공하여 팀원들간의 친밀감을 높이고 추억을 남길 수 있는 서비스를 제공합니다.`,
    imgSrc: '/static/images/logo.png',
    href: 'https://blog.grouphi.kr',
  },
  // {
  //   title: 'The Time Machine',
  //   description: `Imagine being able to travel back in time or to the future. Simple turn the knob
  //   to the desired date and press "Go". No more worrying about lost keys or
  //   forgotten headphones with this simple yet affordable solution.`,
  //   imgSrc: '/static/images/time-machine.jpg',
  //   href: '/blog/the-time-machine',
  // },
]

export default projectsData
