import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}



export default function Home({ postsPagination, preview }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  const formattedPost = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });

  const [posts, setPosts] = useState<Post[]>(formattedPost);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );

    setNextPage(postResults.next_page);
    setCurrentPage(postResults.page);

    const morePosts = postResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...morePosts]);
  }

  useEffect(() => {
    alert("AVISO: Esta pagina n??o esta ativa e n??o esta recebendo postagens de autores reais. Por enquanto servira apenas como demonstra????o.")
  }, []);

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div className={commonStyles.info}>
                  <FiCalendar color="#bbbbbb" />
                  <time>{post.first_publication_date}</time>
                  <FiUser color="#bbbbbb" />
                  <span>{post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}

          {nextPage && (
            <button onClick={handleNextPage}>
              Carregar mais posts . . .
            </button>
          )}
        </div>
        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a className={commonStyles.preview}>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const prismic = getPrismicClient();

  //buscar todos os documentos do tipo "post"
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 3,
    }
  );

  const postsIndex = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: response.next_page,
    results: postsIndex,
  };

  return {
    props: {
      postsPagination,
      preview,
    },
  };
};
