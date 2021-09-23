import Image from 'next/image'
import Container from '@/components/Container'
import TagItem from '@/components/TagItem'
import { NotionRenderer, Equation, Code, CollectionRow } from 'react-notion-x'
import BLOG from '@/blog.config'
import formatDate from '@/lib/formatDate'
import { useLocale } from '@/lib/locale'
import { useRouter } from 'next/router'
import Comments from '@/components/Comments'

const mapPageUrl = id => {
  return 'https://www.notion.so/' + id.replace(/-/g, '')
}

const Layout = ({
  children,
  blockMap,
  frontMatter,
  emailHash,
  fullWidth = true,
  tags,
  prev,
  next
}) => {
  const meta = {
    title: frontMatter.title,
    type: 'article'
  }
  const targetRef = useRef(null)
  const { theme } = useTheme()
  return (
    <div className={`${BLOG.font} ${theme}`}>
      <CommonHead meta={meta} />
      
      <Progress targetRef={targetRef} />

      <TopNav tags={tags} />

      <div className='flex justify-between'>

        <LeftAside tags={tags} />

        {/* 主要區塊 */}
        <main className='bg-gray-100 dark:bg-black w-full'>
          {/* 卡牌水平边距wrapper */}
          {/* 文章 */}
          <div className='bg-white dark:border-gray-700 dark:bg-gray-700 duration-200'>

            <header className='md:flex-shrink-0 overflow-y-hidden shadow-sm animate__fadeIn animate__animated'>
              {/* 封面 */}
              {frontMatter.page_cover && frontMatter.page_cover.length > 1 && (
                <img className='bg-center object-cover w-full' style={{ maxHeight: '40rem' }}
                     src={frontMatter.page_cover} alt={frontMatter.title} />
              )}
            </header>

            <article
              ref={targetRef}
              className='overflow-x-auto px-10 py-10 max-w-3xl mx-auto bg-white dark:border-gray-700 dark:bg-gray-700'>
              {/* 文章標題*/}
              <h1 className='font-bold text-4xl text-black my-5 dark:text-white animate__animated animate__fadeIn'>
                {frontMatter.title}
              </h1>

              {/* 文章訊息 */}
              <div className='justify-between flex flex-wrap bg-gray-50 p-2
                  dark:bg-gray-700 dark:text-white'>
                <div className='flex-nowrap flex'>

                  {frontMatter.tags && (
                    <div className='flex flex-nowrap leading-8 p-1'>
                      {frontMatter.tags.map(tag => (
                        <TagItem key={tag} tag={tag} />
                      ))}
                    </div>
                  )}

                  {frontMatter.slug !== 'about' && (<>
                    <a className='flex-nowrap flex hover:bg-blue-500 hover:text-white duration-200 px-1 mx-1'
                       href='/article/about'>
                      <Image href='https://www.baidu.com' alt={BLOG.author} width={20} height={20} src='/avatar.svg'
                             className='rounded-full' />
                      <div className='mx-2 leading-6 my-1 md:block'>{BLOG.author}</div>
                    </a>
                  </>)}

                  {frontMatter.type[0] !== 'Page' && (
                    <div className='flex items-start text-gray-500 dark:text-gray-400 text-sm leading-8 pr-3'>
                      <div>
                        {formatDate(
                          frontMatter?.date?.start_date || frontMatter.createdTime,
                          BLOG.lang
                        )}
                      </div>
                    </div>
                  )}
                </div>
                </div>

              <div>{children}</div>

              {/* Notion文章主體 */}
              {blockMap && (
                <div>
                  <NotionRenderer
                    recordMap={blockMap}
                    components={{
                      equation: Equation,
                      code: Code,
                      collectionRow: CollectionRow,
                      collection: Collection
                    }}
                    mapPageUrl={mapPageUrl}
                  />
                </div>
              )}

              <div className='flex justify-center py-10'>
                <RewardButton />
              </div>

              <div className='text-gray-800 my-5 dark:text-gray-300'>
                <div className='mt-4 my-2 font-bold'>繼續閱讀</div>
                <div className='flex flex-wrap justify-between py-2'>
                  {/* <Link href={prev.slug}> */}
                  {/* <div>上一篇:<a className='py-1 underline cursor-pointer ml-1'>{prev.title}</a></div> */}
                  {/* </Link> */}
                  <BlogPostMini post={prev} />
                  <BlogPostMini post={next} />
                  {/* <Link href={next.slug}> */}
                  {/* <div>下一篇:<a className='py-1 underline cursor-pointer ml-1'>{next.title}</a></div> */}
                  {/* </Link> */}
                </div>
              </div>

              {/* 分享 */}
              {/* <ShareBar post={frontMatter} /> */}
              {/* <Share url={shareUrl} title={frontMatter.title}/> */}

              {/* 評論 */}
              <Comment frontMatter={frontMatter} />
            </article>

          </div>

          <RightWidget post={frontMatter} />
          {/* <ShareButton post={frontMatter}/> */}
          {/* <TopJumper /> */}

        </main>

        {/* 右侧内容 */}
        <RightAside toc={frontMatter.toc} />

      </div>

    </div>
  )
}

export default Layout