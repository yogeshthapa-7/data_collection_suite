import { useState, useEffect } from 'react'
import { Form, Input, Button, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { useLoginMutation, authApi } from '@/auth/authApi'
import { setCredentials, setUserInfo, setMenus } from '@/auth/authSlice'
import { getClientConfig } from '@/config/env'
import type { LoginDetail } from '@/config/env'

const { Title, Text } = Typography

interface LoginFormValues {
  username: string
  password: string
}

const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Accurate Data',
    subtitle: 'Trusted & Reliable',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-3.148-3.148 9.337 9.337 0 00-4.121.952 9.38 9.38 0 00-2.625.372m0 0a9.375 9.375 0 003.14-2.246m-3.14 2.246a9.375 9.375 0 01-3.14-2.246m0 0a9.375 9.375 0 013.14-2.246M15 19.128v.003M15 19.128a9.375 9.375 0 013.14-2.246m-3.14 2.246a9.375 9.375 0 01-3.14-2.246m6.28 0a9.375 9.375 0 00-6.28 0m6.28 0a9.375 9.375 0 01-6.28 0" />
      </svg>
    ),
    title: 'Better Planning',
    subtitle: 'For Sustainable Growth',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Stronger Communities',
    subtitle: 'A Brighter Future',
  },
]

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login] = useLoginMutation()
  const [loading, setLoading] = useState(false)
  const [clientConfig, setClientConfig] = useState<LoginDetail | null>(null)
  const [configLoading, setConfigLoading] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getClientConfig()
        setClientConfig(config)
      } catch (error) {
        setConfigError('Failed to load client configuration')
        console.error(error)
      } finally {
        setConfigLoading(false)
      }
    }
    fetchConfig()
  }, [])

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const payload = {
        ...values,
        clientcode: import.meta.env.VITE_CLIENT_CODE || 'kmc-dc',
      }

      const response = await login(payload).unwrap()
      const token = response.token || null
      const userGroupCode = response.user_group_code || null
      const clientcode = payload.clientcode

      dispatch(setCredentials({
        token,
        userGroupCode,
        clientCode: clientcode,
        userInfo: null,
        menus: null,
      }))

      const [userInfoRes, menusRes] = await Promise.all([
        dispatch(authApi.endpoints.getLoggedInUserInfo.initiate()).unwrap(),
        dispatch(authApi.endpoints.getLoggedInMenusInfo.initiate()).unwrap(),
      ])

      if (userInfoRes.Success && userInfoRes.Data) {
        dispatch(setUserInfo(userInfoRes.Data))
      }

      if (menusRes.Success && menusRes.Data) {
        dispatch(setMenus(menusRes.Data))
      }

      message.success('Login successful!')

      if (
        (clientcode === 'kmc-dc' || clientcode === 'kmc-dc-local') &&
        (userGroupCode === 'AD' || userGroupCode === 'SA')
      ) {
        navigate('/auth/login/module', { replace: true })
      } else if (clientcode === 'kmc-dc' && userGroupCode === 'OU') {
        navigate('/features/category/organization', { replace: true })
      } else if (clientcode === 'kmc-dc' && userGroupCode === 'SU-AD') {
        navigate('/quotation/suchikrit-request', { replace: true })
      } else if (
        clientcode === 'kage-prj' ||
        clientcode === 'kmc-prj' ||
        clientcode === 'upcode'
      ) {
        window.location.href = 'https://projectmanagement.himalayankasturi.com.np/'
      } else {
        navigate('/features/category', { replace: true })
      }
    } catch (error: any) {
      const status = error?.response?.status
      if (status === 400) {
        message.error('Credential Not Matched')
      } else {
        message.error('Login Failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-between overflow-hidden px-8 py-12 lg:px-24">
      {/* FULL SCREEN BACKGROUND */}
      <img
        src="/assets/images/collection.png"
        alt="Scenic landscape"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-10 bg-black/10" />

      {/* LEFT SIDE - HERO CONTENT */}
      <div className="relative z-20 hidden w-full flex-col justify-center lg:flex lg:w-1/2 xl:w-[55%]">
        <div className="mb-8 flex items-center gap-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-md">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12m-3.75.75h9.75m-9.75 0V19.5m0 2.25h9.75m-9.75 0V19.5m0 2.25h9.75" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">Data Collection</p>
            <p className="text-base font-medium opacity-90">Portal</p>
          </div>
        </div>

        <div className="max-w-2xl text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-90">
            DATA COLLECTION PORTAL
          </p>
          <h1 className="mb-4 text-5xl font-bold leading-tight xl:text-6xl">
            Better Data.<br />
            <span className="text-[#38bdf8]">
              Stronger Communities.
            </span>
          </h1>
          <p className="mb-12 max-w-md text-base leading-relaxed opacity-90">
            Collecting accurate and reliable data for sustainable development and informed decision making.
          </p>

          {/* Feature Items */}
          <div className="flex flex-row flex-wrap gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="text-xs text-white/70">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FLOATING LOGIN FORM CARD */}
      <div className="relative z-20 flex w-full justify-center lg:w-[45%] xl:w-[40%] lg:justify-end">
        <div className="w-full max-w-[460px] rounded-3xl bg-white p-10 shadow-2xl">
          {configLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">Loading configuration...</p>
            </div>
          ) : configError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-red-600">{configError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-sm text-red-600 underline"
              >
                Retry
              </button>
            </div>
          ) : clientConfig ? (
            <>
              {/* Header Section */}
              <div className="mb-8 flex flex-col items-center text-center">
                <img
                   src={clientConfig.mainlogo || '/assets/images/nepal_logo.png'}
                  alt="Nepal Emblem"
                  className="mb-2 h-16 w-auto object-contain"
                />
                <Title level={4} className="!mb-4 !text-xl !font-bold !text-slate-800">
                  {clientConfig.mainHeading}
                </Title>
                
                <div className="mb-4 flex items-center justify-center gap-4">
                  <img
                    src={clientConfig.logo}
                    alt="Main Logo"
                    className="h-20 w-20 w-auto rounded-full border border-slate-100 object-contain p-1 shadow-sm"
                  />
                  <img
                    src={clientConfig.logo3}
                    alt="Nepal Flag"
                    className="h-18 w-18 w-auto object-contain"
                  />
                </div>

                <div className="mt-2 flex flex-col items-center gap-1 text-slate-700">
                  <span className="text-base font-semibold">{clientConfig.Heading}</span>
                  <span className="text-sm font-medium">{clientConfig.Heading2}</span>
                </div>
              </div>

              {/* Login Form Card */}
              <Form
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please enter your username' }]}
                  className="!mb-4"
                >
                  <Input
                    prefix={<UserOutlined className="text-slate-500 mr-2" />}
                    placeholder="kmcadmin"
                    className="!h-12 !rounded-lg !border-transparent !bg-[#f0f4ff] hover:!bg-[#e0eaff] focus:!border-blue-300 focus:!bg-white"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please enter your password' }]}
                  className="!mb-8"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-500 mr-2" />}
                    placeholder="........."
                    className="!h-12 !rounded-lg !border-transparent !bg-[#f0f4ff] hover:!bg-[#e0eaff] focus:!border-blue-300 focus:!bg-white"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item className="!mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    className="!h-12 !rounded-lg !text-base !font-medium"
                    style={{
                      background: '#DC2626',
                      borderColor: '#DC2626',
                      boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.39)',
                    }}
                  >
                    Sign me in
                  </Button>
                </Form.Item>
              </Form>

              {/* Slogan Banner */}
              <div className="mt-8 text-center">
                <Text className="text-xs text-slate-500">
                  *{clientConfig.slogan}*
                </Text>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default LoginPage